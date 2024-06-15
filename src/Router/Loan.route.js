import express from "express";
import {
  submitCarLoan,
  submitPersonalLoan,
} from "../Controller/Loan.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";

const loanRouter = express.Router();

// -------------CAR LOAN----------------

loanRouter.route("/loan/car").post(
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "drivingLicenseUrl", maxCount: 1 },
    { name: "panCardUrl", maxCount: 1 },
    { name: "otherDocumentUrl", maxCount: 1 },
  ]),
  submitCarLoan
);

//--------------PERSONAL LOAN--------------

loanRouter.route("/loan/personal").post(
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "panCardUrl", maxCount: 1 },
    { name: "passportSizePhotoUrl", maxCount: 1 },
    { name: "salarySlipUrl", maxCount: 1 },
    { name: "bankStatementUrl", maxCount: 1 },
    { name: "officeIdUrl", maxCount: 1 },
  ]),
  submitPersonalLoan
);

//--------------HOME LOAN--------------

loanRouter.route("/loan/home").post(
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "drivingLicenseUrl", maxCount: 1 },
    { name: "panCardUrl", maxCount: 1 },
    { name: "otherDocumentUrl", maxCount: 1 },
  ]),
  submitPersonalLoan
);

export default loanRouter;
