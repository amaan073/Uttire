import express from "express";

const router = express.Router();

// Products
router.get("/featured", getFeaturedProducts);
