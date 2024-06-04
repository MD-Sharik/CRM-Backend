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
const userExists = async (email) => {
  const user = await User.findOne({ email });
  console.log(!!User);
  console.log(email);
  return !!user;
};

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<p>Enter the OTP <b>${otp}</b> in the app to verify your email.</p><p>This OTP <b>expires in 10 minutes</b>.</p>`,
  };
  transporter.sendMail(mailOptions);
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
        .json({ message: "agent does not exist. Please sign up." });
    }

    // Generate JWT token
    const token = jwt.sign({ referralId }, process.env.JWTSECRET);

    res.status(200).json({ token, referralId });
    console.log("agent Logged in Successfully");
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
    if (await userExists(email)) {
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
      upperCaseAlphabets: False,
      specialChars: false,
    });
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    const newOTPVerfication = new userOTPVerification({
      userId: savedUser._Id,
      opt: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });

    await newOTPVerfication.save();
    await sendOTP(email, otp);
    res.status(201).json({
      message: "User created successfully, Check your email for verification",
      redirectUrl: "https://crm-backend-jade.vercel.app/user/verify-otp", // Replace with your actual URL
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verfiyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP are Required" });
    }
    const userOTPRecord = await userOTPVerification.findOne({ userId });
    if (!userOTPRecord) {
      return res.status(400).json({ message: "Invalid User ID or OTP" });
    }

    if (userOTPRecord.expiredAt < Date.now()) {
      await userOTPVerification.deleteMany({ userId });
      return res.status(400).json({ message: "OTP Expired, Request New OTP" });
    }

    const validOTP = await bcrypt.compare(otp, userOTPRecord.otp);
    if (!validOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    await User.updateOne({ _id: userId }, { verified: true });
    await userOTPVerification.deleteMany({ userId });
    res.status(200).json({ message: "Email verified Successfully" });
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
  verfiyOTP,
};
