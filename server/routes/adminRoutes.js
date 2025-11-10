import express from "express";
import {
  getAdminDashboard,
  getAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, and WEBP files are allowed"));
  },
});

// get admin dashboard
router.get("/dashboard", protect, adminOnly, getAdminDashboard);

// get admin products
router.get("/products", protect, adminOnly, getAdminProducts);

// add new products
router.post(
  "/products",
  protect,
  adminOnly,
  upload.single("image"),
  addAdminProduct
);

// edit product
router.put(
  "/product/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateAdminProduct
);

router.delete("/product/:id", protect, adminOnly, deleteAdminProduct);

export default router;
