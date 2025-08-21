// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // keep it minimal
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Short-lived
  );
};

export default generateToken;
