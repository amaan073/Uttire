import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";   
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/connectDB.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 4000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser()); // ✅ parse cookies

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // ✅ send cookies
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);


/* If no route matched, notFound runs  (this must come after routes so when there is no route handler for a route that means 
 there is no route for that request so in the end notFound error middleware is executed and error hanlder middleware handles this*/
app.use(notFound);

// Handle all errors
app.use(errorHandler);

// Start server
app.listen(PORT, () =>
  console.log(`🚀 server is running on port: ${PORT}`)
);
