import mongoose from "mongoose";

//  Address Schema
const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    type: { type: String, enum: ["home", "office", "other"], default: "home" },
  },
  { _id: false } //
);

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    refreshToken: { type: String, select: false, default: null },

    //  Profile Information
    profileImage: { type: String, default: "" },
    phone: {
      type: String,
      default: "",
      match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
    },

    //  Settings
    // accountPrivacy: { type: Boolean, default: true },
    // emailAlerts: { type: Boolean, default: true },
    twoFactorAuth: {
      type: String,
      enum: ["off", "sms", "email", "app"],
      default: "off",
    },

    //  Addresses
    address: { type: addressSchema, default: null },

    // 🛒 Cart
    cart: [cartItemSchema],

    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
