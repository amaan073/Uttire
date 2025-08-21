// utils/generateRefreshToken.js
import jwt from "jsonwebtoken";

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId }, // minimal data for security
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Long lifespan compared to access token
  );
};

export default generateRefreshToken;
