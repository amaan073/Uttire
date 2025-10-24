import express from "express";
import {
  getAdminDashboard,
  getAdminProducts,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// @route GET /api/admin/dashboard
// @desc  Get admin stats + recent orders
// @access Private/Admin
router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/products", protect, adminOnly, getAdminProducts);

export default router;
