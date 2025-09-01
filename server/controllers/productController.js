import Product from "../models/productModel.js";

// ========================= Featured Prodcuts (homepage) =========================
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find(
      { featured: true }, // only featured ones
      "name price image description category brand" // only needed fields
    ).limit(8); // fetch limited count

    res.json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getFeaturedProducts };
