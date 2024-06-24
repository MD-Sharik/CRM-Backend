import CarLoan from "../Models/LoanType/CarLoan.model.js";
import HomeLoan from "../Models/LoanType/HomeLoan.model.js";
import PersonalLoan from "../Models/LoanType/PersonalLoan.model.js";
import User from "../Models/UserData/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Agent from "../Models/EmployeeData/Employee.model.js";

const agentExists = async (referralId) => {
  const agent = await Agent.findOne({ referralId });
  return !!agent;
};

export const submitCarLoan = async (req, res) => {
  try {
    const { name, email, userId, amount, duration, referralId } = req.body;

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
    if (!(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
    }

    const aadhaar = await uploadOnCloudinary(aadhaarLocalPath);
    const panCardUrl = await uploadOnCloudinary(panCardLocalPath);
    const drivingLicenseUrl = await uploadOnCloudinary(drivingLocalPath);
    const otherDocumentUrl = await uploadOnCloudinary(otherDocumentLocalPath);

    const user = await User.findById(userId);

    const carLoan = await CarLoan.create({
      name,
      email,
      referralId,
      loanType: "Car Loan",
      userId: user._id,
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
    const { name, email, userId, amount, duration, referralId } = req.body;

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
    if (!(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
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
      referralId,
      loanType: "Home Loan",
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
    const { name, email, userId, amount, duration, referralId } = req.body;

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
    if (!passportImageLocalPath) {
      console.log("Passport Size Image file not found");
      throw new Error("Passport Size Image file not found");
    }
    if (!salaryLocalPath) {
      console.log("Salary Document file not found");
      throw new Error("Salary Document file not found");
    }

    if (!bankStatementLocalPath) {
      console.log("Bank Statement Document file not found");
      throw new Error("Bank Statement Document file not found");
    }

    if (!officeIdLocalPath) {
      console.log("OfficeId Document file not found");
      throw new Error("OfficeId Document file not found");
    }
    if (!(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
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
      referralId,
      loanType: "Personal Loan",
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

export const getLoanStatus = async (req, res) => {
  const { userId } = req.query;
  try {
    console.log(`Fetching loans for userId: ${userId}`);

    const carLoans = await CarLoan.find({ userId: userId });
    const homeLoans = await HomeLoan.find({ userId: userId });
    const personalLoans = await PersonalLoan.find({ userId: userId });

    console.log("Car Loans: ", carLoans);
    console.log("Home Loans: ", homeLoans);
    console.log("Personal Loans: ", personalLoans);

    const allLoans = [];

    carLoans.forEach((loan) =>
      allLoans.push({ ...loan.toObject(), loanType: "CarLoan" })
    );
    homeLoans.forEach((loan) =>
      allLoans.push({ ...loan.toObject(), loanType: "HomeLoan" })
    );
    personalLoans.forEach((loan) =>
      allLoans.push({ ...loan.toObject(), loanType: "PersonalLoan" })
    );

    console.log("All Loans: ", allLoans);

    res.status(200).json({ allLoans });
  } catch (error) {
    console.error("Error fetching loans", error);
    res.status(500).json({
      message: "Error fetching LoanData",
      error: error.message,
    });
  }
};

export const getLoanList = async (req, res) => {
  const { referralId } = req.query;
  try {
    console.log(`Fetching loans for refID: ${referralId}`);
    const carLoans = await CarLoan.find({
      referralId: referralId,
      isApproved: false,
      isRejected: false,
    });
    const homeLoans = await HomeLoan.find({
      referralId: referralId,
      isApproved: false,
      isRejected: false,
    });
    const personalLoans = await PersonalLoan.find({
      referralId: referralId,
      isApproved: false,
      isRejected: false,
    });

    const LoanList = [];
    carLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "CarLoan" })
    );
    homeLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "HomeLoan" })
    );
    personalLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "PersonalLoan" })
    );

    return res.status(200).json({ LoanList });
  } catch (error) {
    console.error("Error fetching loans", error);
    res.status(500).json({
      message: "Error fetching LoanData",
      error: error.message,
    });
  }
};
export const getLoanHistory = async (req, res) => {
  const { referralId } = req.query;
  try {
    console.log(`Fetching loans for refID: ${referralId}`);
    const carLoans = await CarLoan.find({
      referralId: referralId,
      $or: [
        { isApproved: false, isRejected: true },
        { isApproved: true, isRejected: false },
      ],
    });
    const homeLoans = await HomeLoan.find({
      referralId: referralId,
      $or: [
        { isApproved: false, isRejected: true },
        { isApproved: true, isRejected: false },
      ],
    });
    const personalLoans = await PersonalLoan.find({
      referralId: referralId,
      $or: [
        { isApproved: false, isRejected: true },
        { isApproved: true, isRejected: false },
      ],
    });

    const LoanList = [];
    carLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "CarLoan" })
    );
    homeLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "HomeLoan" })
    );
    personalLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "PersonalLoan" })
    );

    return res.status(200).json({ LoanList });
  } catch (error) {
    console.error("Error fetching loans", error);
    res.status(500).json({
      message: "Error fetching LoanData",
      error: error.message,
    });
  }
};

export const detailLoan = async (req, res) => {
  try {
    const { _id } = req.query;
    let car = await CarLoan.findOne({ _id });
    let home = await HomeLoan.findOne({ _id });
    let personal = await PersonalLoan.findOne({ _id });

    if (!car && !home && !personal) {
      return res.status(404).json({
        message: "No loans found for the specified user",
      });
    }

    res.status(200).json({
      car,
      home,
      personal,
    });
  } catch (error) {
    console.error("error getting user details", error);
    return res.status(401).json({
      message: "Error fetching data of user",
      error: error.message,
    });
  }
};

export const approveLoan = async (req, res) => {
  const { _id } = req.body;
  try {
    let carUpdate = await CarLoan.updateOne(
      { _id },
      { $set: { isApproved: true, isRejected: false } }
    );
    let homeUpdate = await HomeLoan.updateOne(
      { _id },
      { $set: { isApproved: true, isRejected: false } }
    );
    let personalUpdate = await PersonalLoan.updateOne(
      { _id },
      { $set: { isApproved: true, isRejected: false } }
    );
    if (
      carUpdate.nModified ||
      homeUpdate.nModified ||
      personalUpdate.nModified
    ) {
      return res.status(200).json({ message: "Loan approved successfully" });
    } else {
      return res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while approving the loan" });
  }
};
export const rejectLoan = async (req, res) => {
  const { _id } = req.body;
  try {
    let carUpdate = await CarLoan.updateOne(
      { _id },
      { $set: { isRejected: true, isApproved: false } }
    );
    let homeUpdate = await HomeLoan.updateOne(
      { _id },
      { $set: { isRejected: true, isApproved: false } }
    );
    let personalUpdate = await PersonalLoan.updateOne(
      { _id },
      { $set: { isRejected: true, isApproved: false } }
    );
    if (
      !carUpdate.nModified ||
      !homeUpdate.nModified ||
      !personalUpdate.nModified
    ) {
      return res.status(200).json({ message: "Loan rejected successfully" });
    } else {
      return res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while rejecting the loan" });
  }
};
