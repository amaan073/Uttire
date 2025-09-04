import express from "express";
import {
  getFeaturedProducts,
  getProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/featured", getFeaturedProducts);

router.get("/", getProducts);

export default router;
