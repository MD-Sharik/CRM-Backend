import dotenv from "dotenv";
import User from "../Models/UserData/User.model.js";
import jwt from "jsonwebtoken";

dotenv.config({
  path: "./env",
});

const userExists = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWTSECRET);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    if (!(await userExists(email))) {
      return res
        .status(400)
        .json({ message: "User does not exist. Please sign up." });
    }

    // Validate password
    const user = await User.findOne({ email });
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.verified) {
      return res.status(401).json({ message: "Please verify your account" });
    }

    // Generate JWT token
    const token = jwt.sign({ email, userId: user._id }, process.env.JWTSECRET);

    res.status(200).json({ token, userId: user._id, email });
    console.log("User Logged in Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  userLogin,
  verifyToken,
};
