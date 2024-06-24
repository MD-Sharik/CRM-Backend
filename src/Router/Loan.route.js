import express from "express";
import {
  getLoanStatus,
  submitCarLoan,
  submitPersonalLoan,
  getLoanList,
  detailLoan,
  submitHomeLoan,
  approveLoan,
  rejectLoan,
  getLoanHistory,
} from "../Controller/loan.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";

const loanRouter = express.Router();

// -------------CAR LOAN-------------------------------

loanRouter.route("/loan/car").post(
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "drivingLicenseUrl", maxCount: 1 },
    { name: "panCardUrl", maxCount: 1 },
    { name: "otherDocumentUrl", maxCount: 1 },
  ]),
  submitCarLoan
);

//--------------PERSONAL LOAN---------------------------

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

//------------------HOME LOAN-------------------------

loanRouter.route("/loan/home").post(
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "drivingLicenseUrl", maxCount: 1 },
    { name: "panCardUrl", maxCount: 1 },
    { name: "otherDocumentUrl", maxCount: 1 },
  ]),
  submitHomeLoan
);

//--------------LOAN STATUS---------------------------

loanRouter.route("/loan/status").get(getLoanStatus);
loanRouter.route("/agent/loanlist").get(getLoanList);
loanRouter.route("/agent/loanhistory").get(getLoanHistory);
loanRouter.route("/agent/detailloan").get(detailLoan);

// -----------LOAN APPROVE/REJECT---------------------
loanRouter.route("/agent/approveloan").put(approveLoan);
loanRouter.route("/agent/rejectloan").put(rejectLoan);

export default loanRouter;
