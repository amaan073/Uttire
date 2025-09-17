import User from "../models/userModel.js";
import Product from "../models/productModel.js";

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "cart.product",
      select: "name price discount image color stock", // only what cart needs
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.cart || []);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/cart
export const addToCart = async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;

  try {
    // ✅ Check user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Check product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Validate size
    if (!product.sizes.includes(size)) {
      return res.status(400).json({ message: "Invalid size selected" });
    }

    // ✅ Check if item already exists in cart
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, size, quantity });
    }

    await user.save();

    // ✅ Return populated cart
    const populatedUser = await User.findById(req.user.id).populate(
      "cart.product",
      "name price discount image color stock"
    ); // select only needed fields

    res.json(populatedUser.cart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/cart
export const updateCartQuantity = async (req, res) => {
  const { id } = req.params; // cart item _id
  const { quantity } = req.body;

  try {
    const user = await User.findById(req.user.id).populate(
      "cart.product",
      "name price discount image color stock"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // find cart item
    const cartItem = user.cart.id(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    cartItem.quantity = quantity;
    await user.save();

    // repopulate after save
    await user.populate(
      "cart.product",
      "name price discount image color stock"
    );

    res.json(user.cart);
  } catch (err) {
    console.error("Error updating cart quantity:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/cart/:productId
export const removeFromCart = async (req, res) => {
  const { id } = req.params; // this should be the cart item _id

  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out the matching cart item by its _id
    user.cart = user.cart.filter((item) => item._id.toString() !== id);

    await user.save();

    // Return populated cart so frontend has product info
    await user.populate(
      "cart.product",
      "name price discount image color stock"
    );
    res.json(user.cart);
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};
