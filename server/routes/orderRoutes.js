import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyOrders);
router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
