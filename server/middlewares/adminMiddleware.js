import User from "../models/userModel.js";

export const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    console.error("Admin check failed:", error);
    res.status(500).json({ message: "Server error during admin check" });
  }
};
