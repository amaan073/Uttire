import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

/**
 * @desc Get admin dashboard stats + recent orders
 * @route GET /api/admin/dashboard
 * @access Private (Admin only)
 */
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

/**
 * @desc Get all products for admin panel
 * @route GET /api/admin/products
 * @access Private/Admin
 */
export const getAdminProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // count total products for totalPages
    const total = await Product.countDocuments();

    // Return products and metadata
    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error("Admin products fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Add a new product (Admin)
 * @route POST /api/admin/products
 * @access Private/Admin
 */

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
