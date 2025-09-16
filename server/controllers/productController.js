import Product from "../models/productModel.js";
import mongoose from "mongoose";

// ========================= Featured Prodcuts (homepage) =========================
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find(
      { featured: true } // only featured ones
    ).limit(8); // fetch limited count

    res.json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= Get All products (Shop page) (and also filter product) =========================
export const getProducts = async (req, res) => {
  try {
    const {
      genders,
      sizes,
      colors,
      minPrice,
      maxPrice,
      page = 1,
      limit = 9,
    } = req.query;
    const filter = {};

    if (genders) {
      filter.gender = {
        $in: genders
          .split(",")
          .map((g) => g.charAt(0).toUpperCase() + g.slice(1)),
      };
    }
    if (sizes) {
      filter.sizes = { $in: sizes.split(",").map((s) => s.toUpperCase()) };
    }
    if (colors) {
      filter.color = {
        $in: colors
          .split(",")
          .map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
      };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    //to skip number of documents in the db collection ex. for 1st skips 0 doc, 2nd page skips 9 and sstart from 10th and send other 9 inlimit
    const products = await Product.find(filter).skip(skip).limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      products,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ========================= Get product details (product detail page) =========================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ========================= add Product review  =========================
export const addProductReview = async (req, res) => {
  try {
    const { userId, name, rating, comment } = req.body;

    // validation
    if (!rating || rating < 1) {
      return res.status(400).json({ message: "Rating is required" });
    }

    // find product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // review project
    const review = {
      userId: userId,
      name: name || "Anonymous",
      rating: Number(rating),
      comment: comment?.trim() || "", // optional, trim whitespace
      verified: true, // dummy
      date: new Date(), // optional, schema default already handles it
    };

    product.reviews.push(review);

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      review,
      productId: product._id, // optional: return productId if needed
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= get reviews  =========================
export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5, sort = "recent" } = req.query;

    // find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // sort reviews
    let sortedReviews = [...product.reviews];
    if (sort === "highest") {
      sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (sort === "lowest") {
      sortedReviews.sort((a, b) => a.rating - b.rating);
    } else {
      // recent = by date desc
      sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit);
    const reviewsSlice = sortedReviews.slice(startIndex, endIndex);

    const hasMore = endIndex < sortedReviews.length;

    res.json({
      reviews: reviewsSlice,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= get related products  =========================
export const getRelatedProducts = async (req, res) => {
  try {
    console.log(req.query);
    const { category, exclude, limit = 8 } = req.query;

    const filter = { category };

    if (exclude && mongoose.Types.ObjectId.isValid(exclude)) {
      filter._id = { $ne: new mongoose.Types.ObjectId(exclude) };
    }

    const relatedProducts = await Product.find(filter).limit(Number(limit));

    return res.status(200).json(relatedProducts);
  } catch (error) {
    console.error("Error in getRelatedProducts:", error); // 👈 log it
    return res.status(401).json({
      message: "Failed to fetch related products",
      error: error.message,
    });
  }
};
