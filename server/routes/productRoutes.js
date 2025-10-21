import express from "express";
import {
  getFeaturedProducts,
  getProducts,
  getProductById,
  addProductReview,
  getProductReviews,
  getRelatedProducts,
  getSearchedProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/featured", getFeaturedProducts);

router.get("/", getProducts);

router.get("/related", getRelatedProducts);

router.get("/search", getSearchedProducts);

// these routes must be put in last because if we put /related below these routes than express treat req on /related or /featured as /:id means, express takes related or featured as :id not hittig the /related or /featured route if below /:id routes
router.get("/:id", getProductById);

router.post("/:id/reviews", addProductReview);

router.get("/:id/reviews", getProductReviews);

export default router;
