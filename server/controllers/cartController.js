import User from "../models/userModel.js";
import Product from "../models/productModel.js";

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product"); // to populate this user with the product details replacing product id only
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.cart || []);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/cart
export const addToCart = async (req, res) => {
  const { productId, size, quantity } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅  check if size is valid
    if (!product.sizes.includes(size)) {
      return res.status(400).json({ message: "Invalid size selected" });
    }

    // ✅ Check if same product+size is already in cart
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ product: productId, size, quantity: quantity || 1 });
    }

    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/cart/:productId
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};
