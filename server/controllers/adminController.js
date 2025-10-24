import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

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
