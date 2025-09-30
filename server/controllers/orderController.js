import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// @desc   Create a new order
// @route  POST /api/orders
// @access Private
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession(); // to create order and clear cart in single transaction
  session.startTransaction();

  try {
    const { order, source } = req.body;

    // validation
    if (!order?.items || order.items.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one item" });
    }

    // 🛒 (Optional) Stock check + deduction
    for (const item of order.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction(); // have to abort transation manually here if we are not using throw err method
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
          code: "INSUFFICIENT_STOCK", // 👈 unique flag
          productId: product._id, // useful for frontend
        });
      }
      product.stock -= item.quantity;
      await product.save({ session });
    }

    // Create the order
    const newOrder = new Order({
      user: req.user.id, // from protect middleware
      ...order,
    });

    const createdOrder = await newOrder.save({ session });

    // If it's cart checkout, clear cart inside the same transaction
    if (source === "cart") {
      await User.findByIdAndUpdate(
        req.user.id,
        { $set: { cart: [] } },
        { session }
      );
    }

    // Commit transaction
    await session.commitTransaction();

    res.status(201).json(createdOrder);
  } catch (error) {
    // Rollback everything if any step fails
    await session.abortTransaction();

    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc   Get logged in user's orders
// @route  GET /api/orders/my
// @access Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// @desc   Get single order by ID
// @route  GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ensure user owns the order
    if (order.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};
