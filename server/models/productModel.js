import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String },
  rating: { type: Number },
  comment: { type: String },
  date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sizes: [{ type: String }], // ["S","M","L","XL"]
    quantity: { type: Number, default: 1 },
    image: { type: String },
    category: { type: String }, // T-Shirts, Hoodies, etc
    gender: { type: String, enum: ["Men", "Women", "Unisex"] },
    color: { type: String },
    featured: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    easyReturns: { type: Boolean, default: false },
    fabric: { type: String },
    care: { type: [String] },
    fit: { type: String },
    modelInfo: { type: String },
    specifications: { type: Map, of: String },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
