import dotenv from "dotenv";
import Agent from "../Models/EmployeeData/Employee.model.js";
import User from "../Models/UserData/User.model.js";
import userOTPVerification from "../Models/UserOTPVerificationForm/UserOTPVerification.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";

dotenv.config({
  path: "./env",
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const agentExists = async (referralId) => {
  const agent = await Agent.findOne({ referralId });
  console.log(!!agent);
  console.log(referralId);
  return !!agent;
};
const userExists = async (email, phone) => {
  const user = await User.findOne({ email, phone });
  console.log(!!user);
  console.log(email, phone);
  return !!user;
};

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification</title>
      <style>
        /* Reset some default styles */
        body, p {
          margin: 0;
          padding: 0;
        }

        /* Style for the container */
        .container {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        /* Style for the paragraphs */
        p {
          margin-bottom: 10px;
          font-size: 16px;
          line-height: 1.5;
        }

        /* Style for the bold text */
        #id {
          color: #007bff;
          background:white;
          display:inline-block;
          padding:5px 10px;
          border-radius:0.5rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p>Enter the OTP <span id="id">${otp}</span> in the app to verify your email.</p>
        <p>This OTP <b>expires in 10 minutes</b>.</p>
      </div>
    </body>
    </html>


    `,
  };

  await transporter.sendMail(mailOptions);
};

// Middleware for authentication
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWTSECRET);
    req.agent = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export const agentLogin = async (req, res) => {
  try {
    const { referralId, password } = req.body;

    // Check if agent exists
    if (!(await agentExists(referralId))) {
      return res
        .status(400)
        .json({ message: "Agent does not exist. Please sign up." });
    }

    // Generate JWT token
    const token = jwt.sign({ referralId }, process.env.JWTSECRET);

    res.status(200).json({ token, referralId });
    console.log("Agent Logged in Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const agentSignup = async (req, res) => {
  try {
    const { Name, password, referralId, Phone } = req.body;

    // Check if user already exists
    if (await agentExists(referralId)) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    // Hash password for security
    const hashedPassword = await Agent.hashPassword(password);

    // Create new user
    const agent = new Agent({
      referralId,
      Name,
      password: hashedPassword,
      Phone,
    });

    await agent.save();

    res.status(201).json({ message: "Agent created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, referralId } =
      req.body;

    // Check if referral ID is valid
    if (!(await agentExists(referralId))) {
      return res.status(400).json({ message: "Invalid referral ID" });
    }

    // Check if user already exists
    if (await userExists(email, phone)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password for security
    const hashedPassword = await User.hashPassword(password);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      referralId,
      verified: false,
    });

    const savedUser = await user.save();

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const newOTPVerfication = new userOTPVerification({
      userId: savedUser._id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 600000,
    });

    await newOTPVerfication.save();

    // Try sending OTP email with error handling
    try {
      await sendOTP(email, otp);
    } catch (error) {
      console.error("Error sending OTP email:", error);
      // Consider logging the error and sending a notification to the admin
      // You can return a specific error code for email sending issue here
    }

    res.status(201).json({
      message: "User created successfully, Check your email for verification",
      userId: savedUser._id,
      redirectUrl: "api/v1/user/verify-otp", // Replace with your actual URL
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    // Log the error with details for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP are required" });
    }
    const userOTPRecord = await userOTPVerification.findOne({ userId });
    if (!userOTPRecord) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    if (userOTPRecord.expiresAt < Date.now()) {
      await userOTPVerification.deleteMany({ userId });
      return res.status(400).json({ message: "OTP Expired, Request New OTP" });
    }

    const validOTP = await bcrypt.compare(otp, userOTPRecord.otp);
    if (!validOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    await User.updateOne({ _id: userId }, { verified: true });
    await userOTPVerification.deleteMany({ userId });
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  agentLogin,
  agentSignup,
  userSignup,
  verifyToken,
  verifyOTP,
};
