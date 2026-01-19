import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/connectDB.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Load env variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Trust proxy for Render deployment
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(cookieParser()); //  parse cookies

// Health check (works in dev & production)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(), // seconds server has been running
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
          imgSrc: [
            "'self'",
            "data:",
            "blob:", // REQUIRED for image previews
            "https://res.cloudinary.com",
          ],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
        },
      },
    })
  );

  // Rate limiting (applied only to API routes)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 100 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api", limiter);
}

// Only enable CORS in development
if (process.env.NODE_ENV === "production") {
  // In production, serve frontend from same origin
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
} else {
  // In development, allow localhost:5173
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/dist");

  app.use(express.static(clientBuildPath));

  // API Routes (must come BEFORE the catch-all)
  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/admin", adminRoutes);

  // React SPA Serve (EXCLUDES /api routes)
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  // Development mode - just API routes
  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/admin", adminRoutes);
}

app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  }
});
