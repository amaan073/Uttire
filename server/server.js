import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/connectDB.js"

// Load env variables
dotenv.config();

//connect to mongodb database
connectDB();


const PORT = process.env.PORT || 4000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Middleware
app.use(cors());
app.use(express.json()); 



// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);


// Start server
app.listen(PORT, () =>
  console.log(`🚀 server is running on port: ${PORT}`)
);
