import CarLoan from "../Models/LoanType/CarLoan.model.js";
import HomeLoan from "../Models/LoanType/HomeLoan.model.js";
import PersonalLoan from "../Models/LoanType/PersonalLoan.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const submitCarLoan = async (req, res) => {
  try {
    const { name, email, userId, amount, duration } = req.body;
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    const aadhaarLocalPath = req.files?.aadhaar?.[0]?.path;
    const panCardLocalPath = req.files?.panCardUrl?.[0]?.path;
    const drivingLocalPath = req.files?.drivingLicenseUrl?.[0]?.path;
    const otherDocumentLocalPath = req.files?.otherDocumentUrl?.[0]?.path;

    if (!aadhaarLocalPath) {
      console.log("Aadhaar file not found");
      throw new Error("Aadhaar file not found");
    }
    if (!panCardLocalPath) {
      console.log("Pan Card file not found");
      throw new Error("Pan Card file not found");
    }
    if (!drivingLocalPath) {
      console.log("Driving License file not found");
      throw new Error("Driving License file not found");
    }
    if (!otherDocumentLocalPath) {
      console.log("Other Document file not found");
      throw new Error("Other Document file not found");
    }

    const aadhaar = await uploadOnCloudinary(aadhaarLocalPath);
    const panCardUrl = await uploadOnCloudinary(panCardLocalPath);
    const drivingLicenseUrl = await uploadOnCloudinary(drivingLocalPath);
    const otherDocumentUrl = await uploadOnCloudinary(otherDocumentLocalPath);

    const carLoan = await CarLoan.create({
      name,
      email,
      userId,
      amount,
      duration,
      aadhaar: aadhaar.url,
      drivingLicenseUrl: drivingLicenseUrl.url || "",
      panCardUrl: panCardUrl.url || "",
      otherDocUrl: otherDocumentUrl.url || "",
    });

    res.status(200).json({
      message: "Car loan application submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error uploading data",
      error: error.message,
    });
  }
};
export const submitHomeLoan = async (req, res) => {
  try {
    const { name, email, userId, amount, duration } = req.body;
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    const aadhaarLocalPath = req.files?.aadhaar?.[0]?.path;
    const panCardLocalPath = req.files?.panCardUrl?.[0]?.path;
    const drivingLocalPath = req.files?.drivingLicenseUrl?.[0]?.path;
    const otherDocumentLocalPath = req.files?.otherDocumentUrl?.[0]?.path;

    if (!aadhaarLocalPath) {
      console.log("Aadhaar file not found");
      throw new Error("Aadhaar file not found");
    }
    if (!panCardLocalPath) {
      console.log("Pan Card file not found");
      throw new Error("Pan Card file not found");
    }
    if (!drivingLocalPath) {
      console.log("Driving License file not found");
      throw new Error("Driving License file not found");
    }
    if (!otherDocumentLocalPath) {
      console.log("Other Document file not found");
      throw new Error("Other Document file not found");
    }

    const aadhaar = await uploadOnCloudinary(aadhaarLocalPath);
    const panCardUrl = await uploadOnCloudinary(panCardLocalPath);
    const drivingLicenseUrl = await uploadOnCloudinary(drivingLocalPath);
    const otherDocumentUrl = await uploadOnCloudinary(otherDocumentLocalPath);

    const homeLoan = await HomeLoan.create({
      name,
      email,
      userId,
      amount,
      duration,
      aadhaar: aadhaar.url,
      drivingLicenseUrl: drivingLicenseUrl.url || "",
      panCardUrl: panCardUrl.url || "",
      otherDocUrl: otherDocumentUrl.url || "",
    });

    res.status(200).json({
      message: "Car loan application submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error uploading data",
      error: error.message,
    });
  }
};
export const submitPersonalLoan = async (req, res) => {
  try {
    const { name, email, userId, amount, duration } = req.body;

    const panCardLocalPath = req.files?.panCardUrl?.[0]?.path;
    const aadhaarLocalPath = req.files?.aadhaar?.[0]?.path;
    const passportImageLocalPath = req.files?.passportSizePhotoUrl?.[0]?.path;
    const salaryLocalPath = req.files?.salarySlipUrl?.[0]?.path;
    const bankStatementLocalPath = req.files?.bankStatementUrl?.[0]?.path;
    const officeIdLocalPath = req.files?.officeIdUrl?.[0]?.path;

    if (!aadhaarLocalPath) {
      console.log("Aadhaar file not found");
      throw new Error("Aadhaar file not found");
    }
    if (!panCardLocalPath) {
      console.log("Pan Card file not found");
      throw new Error("Pan Card file not found");
    }
    if (!drivingLocalPath) {
      console.log("Driving License file not found");
      throw new Error("Driving License file not found");
    }
    if (!otherDocumentLocalPath) {
      console.log("Other Document file not found");
      throw new Error("Other Document file not found");
    }

    const aadhaar = await uploadOnCloudinary(aadhaarLocalPath);
    const passportSizePhotoUrl = await uploadOnCloudinary(
      passportImageLocalPath
    );
    const salarySlipUrl = await uploadOnCloudinary(salaryLocalPath);
    const bankStatementUrl = await uploadOnCloudinary(bankStatementLocalPath);
    const officeIdUrl = await uploadOnCloudinary(officeIdLocalPath);
    const panCardUrl = await uploadOnCloudinary(panCardLocalPath);

    const personalLoan = await PersonalLoan.create({
      name,
      email,
      userId,
      amount,
      duration,
      aadhaar: aadhaar.url,
      passportSizePhotoUrl: passportSizePhotoUrl.url || "",
      bankStatementUrl: bankStatementUrl.url || "",
      salarySlipUrl: salarySlipUrl.url || "",
      officeIdUrl: officeIdUrl.url || "",
      panCardUrl: panCardUrl.url || "",
    });

    res.status(200).json({
      message: "Car loan application submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error uploading data",
      error: error.message,
    });
  }
};
