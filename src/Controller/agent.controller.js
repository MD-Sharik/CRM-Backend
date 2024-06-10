import dotenv from "dotenv";
import Agent from "../Models/EmployeeData/Employee.model.js";
import User from "../Models/UserData/User.model.js";
import userOTPVerification from "../Models/UserOTPVerificationForm/UserOTPVerification.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { signupSchema } from "../Middlewares/ValidationSchema.js";
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
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w=
3.org/TR/REC-html40/loose.dtd">
<html xmlns=3D"http://www.w3.org/1999/xhtml">
<head>
<meta content=3D"text/html; charset=3Dutf-8" http-equiv=3D"content-type">
<meta content=3D"width=3Ddevice-width, initial-scale=3D1.0;" name=3D"viewpo=
rt">
<meta content=3D"telephone=3Dno" name=3D"format-detection">
<!-- /=3Dstylesheet_link_tag("mail_notifier.css") -->
<meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3DUTF-8">
</head>
<body>
<table cellpadding=3D"0" cellspacing=3D"0" class=3D"cld_welcome_section gma=
il-fix" style=3D"min-width:320px;" width=3D"100%">
<tr>
<!-- LEFT COLUMN -->
<td valign=3D"top">
<table cellpadding=3D"0" cellspacing=3D"0" width=3D"100%">
<tr>
<td bgcolor=3D"#005CE4" height=3D"150"></td>
</tr>
</table>
</td>
<!-- CENTER COLUMN -->
<td width=3D"600">
<table align=3D"center" cellpadding=3D"0" cellspacing=3D"0" class=3D"w-100p=
" style=3D"max-width:600px; margin:0 auto;" width=3D"600">
<tr>
<td align=3D"center" bgcolor=3D"#005CE4" mc:edit=3D"block_01" style=3D"padd=
ing:20px 15px 24px;">
</td>
</tr>
<tr>
<td bgcolor=3D"#0071ba" style=3D"border-radius:0 0 10px 10px;">
<table cellpadding=3D"0" cellspacing=3D"0" width=3D"100%">
<tr>
<td bgcolor=3D"#ffffff" style=3D"border-radius:6px; box-shadow:0 2px 2px rg=
ba(0, 0, 0, 0.24);">
<table cellpadding=3D"0" cellspacing=3D"0" width=3D"100%">
<tr>
<td>
<table align=3D"left" class=3D"plr-0" style=3D"width: 100%; margin-bottom: =
40px; padding: 0px 40px 0px 40px; font:500 18px/24px Arial, Helvetica, sans=
-serif, Fira;">
<tr align=3D"center">
<td>
FIRSTINDIA CREDIT
</td>
</tr>
<tr>
<td style=3D"font-size: 16px; line-height: 33px;">
Hi ${firstName},
</td>
</tr>
<tr>
<td style=3D"font-size: 14px; line-height: 33px;">
Here's the confirmation code you requested:
</td>
</tr>
<tr>
<td style=3D"font-size: 28px; line-height: 33px; font-weight: bold;">
${otp}
</td>
</tr>
<td style=3D"font-size: 14px; line-height: 33px;">
If you didn't request this, you can ignore this email or let us know.
</td>
<tr>
<td style=3D"font-size: 14px; line-height: 33px; font-weight: padding-top: =
24px">
<br>
Thanks,
</td>
</tr>
<tr>
<td style=3D"font-size: 14px; line-height: 33px;">
The FIRSTINDIACREDIT Team
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<!-- footer -->
<tr>
<td style=3D"padding:32px 40px;">
<table cellpadding=3D"0" cellspacing=3D"0" width=3D"100%">
<tr>
<td align=3D"center" mc:edit=3D"block_80" style=3D"padding:0 0 22px;">
<a href=3D"https://cloudinary.com" style=3D"text-decoration:none;">
<img alt=3D"Cloudinary Logo" src=3D"https://res.cloudinary.com/cloudinary/i=
mage/upload/c_scale,w_200,dpr_2.0/v1/logo/for_white_bg/cloudinary_icon_for_=
white_bg.png" style=3D"width:54px; font:14px Arial, Helvetica, sans-serif; =
vertical-align:top;" width=3D"54">
</a>
</td>
</tr>
<tr>
<td align=3D"center" mc:edit=3D"block_81" style=3D"padding:0 0 10px; font:5=
00 12px/17px Arial, Helvetica, sans-serif, Fira; color:#a7afb3;">
=C2=A9 2024 Cloudinary. All rights reserved.
</td>
</tr>
<tr>
<td align=3D"center" mc:edit=3D"block_82" style=3D"font:500 12px/17px Arial=
, Helvetica, sans-serif, Fira; color:#0078ff;">
<a href=3D"https://cloudinary.com/contact" style=3D"color:#0078ff; text-dec=
oration:underline;">Contact Us</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
<!-- RIGHT COLUMN -->
<td valign=3D"top">
<table cellpadding=3D"0" cellspacing=3D"0" width=3D"100%">
<tr>
<td bgcolor=3D"#005CE4" height=3D"150"></td>
</tr>
</table>
</td>
</tr>
</table>
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

    const validation = signupSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      referralId,
      phone,
    });
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.errors[0].message,
      });
    }

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

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
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
