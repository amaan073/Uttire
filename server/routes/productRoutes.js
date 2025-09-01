import express from "express";
import { getFeaturedProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/featured", getFeaturedProducts);

export default router;
