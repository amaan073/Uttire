import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

//sign up
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error during sign up!"})
  }
};

//login 
export const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
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

    
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch(error) {
    console.log(error);
    res.status(500).json({message: "Server error during login"})
  }
}
