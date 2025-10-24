import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import jwt from "jsonwebtoken";

// Cookie options (for reuse)
const accessTokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // value false when we are in development mode and true when we are in production mode
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ========================= REGISTER =========================
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error during sign up!" });
  }
};

// ========================= LOGIN =========================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("Invalid email or password");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ========================= REFRESH (rotation) =========================
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required!" });
  }

  try {
    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" }); //to prevent attackers to use random stolen tokens

    // Verify (checks if the token is expired or tempered with)
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err || decoded.id !== user._id.toString()) {
          user.refreshToken = null;
          await user.save();
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate new tokens (rotation)
        const newAccessToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();

        // Reset cookies
        res.cookie("accessToken", newAccessToken, accessTokenOptions);
        res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

        res.json({ message: "Token refreshed" });
      }
    );
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// ========================= LOGOUT =========================
export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    // Clear cookies
    res.clearCookie("accessToken", accessTokenOptions);
    res.clearCookie("refreshToken", refreshTokenOptions);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

// ========================= userInfo (getMe) =========================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email phone address profileImage isAdmin createdAt updatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //sending full url for frontend to be able to use static folder /uploads of the server in the client
    user.profileImage = `${req.protocol}://${req.get("host")}${user.profileImage}`;

    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= Profile info (getProfile) =========================
export const getProfile = async (req, res) => {
  try {
    // req.user is coming from protect middleware (decoded JWT)
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //sending full url for frontend to be able to use static folder /uploads of the server in the client
    user.profileImage = `${req.protocol}://${req.get("host")}${user.profileImage}`;

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= Update Profile info (updateProfile) =========================
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body; //form request body

    const updateFields = { name, phone }; //fields to be updated

    //This checks if the user uploaded a file in this request
    //req.file is added by multer middleware automatically. It contains info of the file like req.file.filename here
    if (req.file) {
      updateFields.profileImage = `/uploads/profile-pics/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields }, //merge new fields(updateFields) and also avoid messing
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    //sending full url for frontend to be able to use static folder /uploads of the server in the client
    user.profileImage = `${req.protocol}://${req.get("host")}${user.profileImage}`;

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= Delete Account(deleteProfile) =========================
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body; // req.user from protect middleware

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required to delete account" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await User.findByIdAndDelete(userId);

    //logout
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// ========================= Change User Password(changePassword) =========================
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { currentPassword, newPassword } = req.body;

    // Check all fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Password rules
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(newPassword) || /\s/.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters, include letters and numbers, and contain no spaces",
      });
    }

    // Find user
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res
      .status(200)
      .json({ message: "Password updated successfully. Please log in again." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================= two factor auth toggle (dummy feature) =========================
export const toggleTwoFactor = async (req, res) => {
  try {
    const { twoFactorAuth } = req.body;

    // Validate request
    const validOptions = ["off", "sms", "email", "app"];
    if (!validOptions.includes(twoFactorAuth)) {
      return res.status(400).json({ message: "Invalid twoFactorAuth option" });
    }

    // Find and update user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.twoFactorAuth = twoFactorAuth;
    await user.save();

    res.status(200).json({
      message: "Two-factor authentication updated",
      twoFactorAuth: user.twoFactorAuth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= manage address  =========================
export const manageAddress = async (req, res) => {
  try {
    const { address } = req.body;

    // handle delete address request (null or empty object)
    if (!address || Object.keys(address).length === 0) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.address = null; // CLEAR the address
      await user.save();

      return res
        .status(200)
        .json({ message: "Address deleted successfully", address: null });
    }

    // validate only if address is not null
    if (
      !address.street ||
      address.street.trim().length < 5 ||
      !/^[a-zA-Z0-9\s]+$/.test(address.street.trim()) ||
      !address.city ||
      !address.state ||
      !address.zip ||
      !/^\d{4,10}$/.test(address.zip.trim()) ||
      !address.country
    ) {
      return res.status(400).json({ message: "Fields are not valid" });
    }

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user's address
    user.address = address;
    await user.save();

    res.status(200).json({
      message: "Address saved successfully",
      address: user.address,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save address" });
  }
};
