import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:id", protect, updateCartQuantity);
router.delete("/:id", protect, removeFromCart);

export default router;
