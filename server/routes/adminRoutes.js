import express from "express";
import {
  getAdminDashboard,
  getAdminProducts,
  addAdminProduct,
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

router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/products", protect, adminOnly, getAdminProducts);
router.post(
  "/products",
  protect,
  adminOnly,
  upload.single("image"),
  addAdminProduct
);

export default router;
