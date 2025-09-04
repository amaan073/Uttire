import Product from "../models/productModel.js";

// ========================= Featured Prodcuts (homepage) =========================
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find(
      { featured: true }, // only featured ones
      "name price image description category brand discount" // only needed fields
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
