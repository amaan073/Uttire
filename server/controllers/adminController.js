import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const getAdminDashboard = async (req, res) => {
  try {
    // Fetch key stats
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totals.total" } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .select("orderNumber customer.name status totals.total createdAt"),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
      },
      recentOrders,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminProducts = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const cursor = req.query.cursor || null; // to fetch items using cursor method

    const query = {};
    if (cursor) {
      // fetch products older than this cursor (strictly less than)
      query._id = { $lt: cursor };
    }

    // sort newest first
    const products = await Product.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1); // one extra to check for hasMore

    // determine if there's more and set nextCursor
    let hasMore = false;
    let nextCursor = null;
    if (products.length > limit) {
      hasMore = true;

      // get nextCursor BEFORE popping
      nextCursor = products[limit - 1]._id.toString();

      products.splice(limit);
    } else if (products.length > 0) {
      nextCursor = products[products.length - 1]._id.toString();
    }

    // respond with products and pagination metadata
    res.status(200).json({
      products,
      hasMore,
      nextCursor,
      limit,
      count: products.length,
    });
  } catch (err) {
    console.error("Admin products fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addAdminProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      discount = 0,
      stock,
      sizes = [],
      category,
      gender,
      color,
      featured = false,
      freeShipping = false,
      easyReturns = false,
      fabric,
      care = [],
      fit,
      modelInfo = "",
    } = req.body;

    // from multer
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // ✅ Upload image to Cloudinary using upload_stream (uploading image buffer from memory to cloudinary directly chunk by chunk)
    const uploadResult = await new Promise((resolve, reject) => {
      /* cloudinary.uploader.upload_stream() is a function that returns a writable stream object (assinged to cloudinaryUploadStream variable here).
      That stream has a built-in function which knows how to send incoming data to Cloudinary’s servers.
      You’re also passing a callback to handle success or failure once the upload completes. */
      // cloudinaryUploadStream is basically a object (writable) that also has a function here for the logic of how will image data be uploaded to cloudinary by stream(way of chunk by chunk transfer of data)
      const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
        { folder: "uttire/products" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Convert the in-memory image buffer into a readable stream (so it can be read as chunks by writable stream as pipe acts like hose that connect readable and writable stream)
      // and pipe it to Cloudinary's writable upload stream (which uploads the data chunk by chunk as it has a function for that)
      Readable.from(file.buffer).pipe(cloudinaryUploadStream);
    });

    // ✅ Create and save product
    const product = new Product({
      name: name.trim(),
      brand: brand.trim(),
      description: description.trim(),
      price: Number(price),
      discount: Math.min(Math.max(Number(discount), 0), 100),
      stock: Number(stock),
      sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes || "[]"), // parsing array from json
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id, // store for later deletion
      category: category.trim(),
      gender: gender.trim(),
      color: color.trim(),
      featured,
      freeShipping,
      easyReturns,
      fabric: fabric.trim(),
      care: Array.isArray(care) ? care : JSON.parse(care || "[]"), // parsing array from json
      fit: fit.trim(),
      modelInfo: modelInfo.trim(),
    });

    // for handlign edge case where mongo db fails just after image is uploaded to cloudinary .
    try {
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (dbErr) {
      // 🧹 MongoDB failed — cleanup uploaded image
      if (uploadResult?.public_id) {
        try {
          await cloudinary.uploader.destroy(uploadResult.public_id);
        } catch (cleanupErr) {
          console.error("Cleanup failed:", cleanupErr);
        }
      }
      throw dbErr; // rethrow to hit main catch
    }
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAdminProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const existing = await Product.findById(productId);
    if (!existing)
      return res.status(404).json({ message: "Product not found" });

    const {
      name,
      brand,
      description,
      price,
      discount = 0,
      stock,
      sizes = [],
      category,
      gender,
      color,
      featured = false,
      freeShipping = false,
      easyReturns = false,
      fabric,
      care = [],
      fit,
      modelInfo = "",
      // optional: frontend may send image URL and/or imagePublicId when not uploading a file
      image: imageFromBody,
      imagePublicId: imagePublicIdFromBody,
    } = req.body;

    // array parser helper function
    const parseArray = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // fallback: comma separated
          return val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      return [];
    };

    const updates = {};

    if (typeof name !== "undefined") updates.name = String(name).trim();
    if (typeof brand !== "undefined") updates.brand = String(brand).trim();
    if (typeof description !== "undefined")
      updates.description = String(description).trim();
    if (typeof price !== "undefined" && price !== "")
      updates.price = Number(price);
    if (typeof discount !== "undefined" && discount !== "")
      updates.discount = Math.min(Math.max(Number(discount), 0), 100);
    if (typeof stock !== "undefined" && stock !== "")
      updates.stock = Number(stock);

    // sizes & care may be arrays or JSON strings
    if (typeof sizes !== "undefined")
      updates.sizes = Array.isArray(sizes) ? sizes : parseArray(sizes);
    if (typeof category !== "undefined")
      updates.category = String(category).trim();
    if (typeof gender !== "undefined") updates.gender = String(gender).trim();
    if (typeof color !== "undefined") updates.color = String(color).trim();

    // booleans come as "true"/"false" or "on" or actual booleans (returns false if any of these values dont match)
    const toBool = (v) => v === true || v === "true" || v === "on";
    if (typeof featured !== "undefined") updates.featured = toBool(featured);
    if (typeof freeShipping !== "undefined")
      updates.freeShipping = toBool(freeShipping);
    if (typeof easyReturns !== "undefined")
      updates.easyReturns = toBool(easyReturns);

    if (typeof fabric !== "undefined") updates.fabric = String(fabric).trim();
    if (typeof care !== "undefined")
      updates.care = Array.isArray(care) ? care : parseArray(care);
    if (typeof fit !== "undefined") updates.fit = String(fit).trim();
    if (typeof modelInfo !== "undefined")
      updates.modelInfo = String(modelInfo).trim();

    // handle image:
    // - if req.file present => upload new image to cloudinary, set image & imagePublicId, and later delete old public id
    // - else if frontend supplied image URL (imageFromBody) possibly with imagePublicId => update fields accordingly (no Cloudinary ops)
    // - else: do not touch image fields (keep existing)
    const file = req.file;
    let uploadResult = null;

    if (file) {
      // upload via stream (same pattern as addAdminProduct)
      uploadResult = await new Promise((resolve, reject) => {
        const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
          { folder: "uttire/products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        Readable.from(file.buffer).pipe(cloudinaryUploadStream);
      });

      updates.image = uploadResult.secure_url;
      updates.imagePublicId = uploadResult.public_id;
    } else if (typeof imageFromBody !== "undefined" && imageFromBody !== null) {
      // frontend explicitly sent an image URL (likely the existing image). Update it as provided.
      updates.image = String(imageFromBody);
      if (typeof imagePublicIdFromBody !== "undefined") {
        updates.imagePublicId = String(imagePublicIdFromBody);
      }
    }

    // If nothing to update and no new file, return the existing product (or you can return 400)
    if (Object.keys(updates).length === 0) {
      return res.status(200).json(existing);
    }

    let updatedProduct;
    // product update
    try {
      updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
        new: true,
        runValidators: true,
      });
    } catch (dbErr) {
      // If DB failed after we uploaded a new image, cleanup the newly uploaded image to avoid orphaned images
      if (uploadResult?.public_id) {
        try {
          await cloudinary.uploader.destroy(uploadResult.public_id);
        } catch (cleanupErr) {
          console.error("Cleanup failed after DB error:", cleanupErr);
        }
      }
      throw dbErr; // rethrow to outer catch
    }

    // If we uploaded a new image successfully and product created, attempt to destroy the old cloudinary image (best-effort)
    if (uploadResult && existing.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      } catch (cleanupErr) {
        console.error("Failed to cleanup old Cloudinary image:", cleanupErr);
        // don't fail the request because of cleanup failure
      }
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAdminProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const existing = await Product.findById(productId);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product document from DB first
    await Product.findByIdAndDelete(productId);

    // 2) Attempt to delete the Cloudinary image (best-effort).
    // If it fails, log error but DO NOT fail the API response.
    if (existing.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      } catch (cloudErr) {
        console.error(
          `Cloudinary cleanup failed for ${existing.imagePublicId}:`,
          cloudErr
        );
        // intentionally ignore error (do not return non-2xx status)
      }
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", id: productId });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
