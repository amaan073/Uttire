import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// @desc   Get logged in user's orders
// @route  GET /api/orders/my
// @access Private
// GET /orders?limit=5&page=1  // dashboard
export const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [orders, stats] = await Promise.all([
      Order.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .populate("items.product", "name image color"),

      Order.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: {
              $sum: {
                $cond: [{ $gt: ["$totals.total", 0] }, "$totals.total", 0],
              },
            },
          },
        },
      ]),
    ]);

    // Move cancelled orders to the end
    const sortedOrders = [
      ...orders.filter((o) => o.status !== "cancelled"),
      ...orders.filter((o) => o.status === "cancelled"),
    ];

    // Pagination AFTER rearranging
    const paginatedOrders = sortedOrders.slice(skip, skip + limit);

    // stats
    const totalOrders = stats[0]?.totalOrders || 0;
    const totalSpent = stats[0]?.totalSpent || 0;
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders: paginatedOrders,
      totalPages,
      totalOrders,
      totalSpent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

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
      const product = await Product.findById(item.product).session(session);
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

    // get latest order number
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const nextOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

    // Create the order
    const newOrder = new Order({
      user: req.user.id, // from protect middleware
      orderNumber: nextOrderNumber,
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
    console.log(error);

    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  } finally {
    session.endSession();
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

// Cancel order
export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
      .populate("items.product", "name stock")
      .session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Order not found" });
    }

    // Guard: prevent cancelling if already cancelled
    if (order.status === "cancelled") {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Order is already cancelled.",
        code: "ALREADY_CANCELLED", // custom code
      });
    }
    if (!["pending", "processing"].includes(order.status)) {
      await session.abortTransaction();
      return res.status(400).json({
        message: `Cannot cancel an order that is ${order.status}.`,
      });
    }

    // Restore stock for each product
    for (const item of order.items) {
      const product = await Product.findById(item.product._id).session(session);
      if (product) {
        product.stock += item.quantity;
        await product.save({ session });
      }
    }

    // Update order status
    order.status = "cancelled";
    await order.save({ session });

    // Commit transaction
    await session.commitTransaction();

    res.json({
      message: "Order cancelled successfully, stock restored.",
      order,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("❌ Error cancelling order:", err);
    res.status(500).json({ message: "Error cancelling order" });
  } finally {
    session.endSession();
  }
};
