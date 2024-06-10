import express from "express";
import upload from "../Controller/Loan/LoanUpload.controller.js";
import {
  createPersonalLoan,
  createHomeLoan,
  createCarLoan,
} from "../Controller/Loan/Loan.controller.js";

const loanRoute = express.Router();
loanRoute.post(
  "/user/loan/personalloan",
  upload.array("document", 10),
  createPersonalLoan
);
loanRoute.post(
  "/user/loan/homeloan",
  upload.array("document", 10),
  createHomeLoan
);
loanRoute.post(
  "/user/loan/carloan",
  upload.array("document", 10),
  createCarLoan
);

export default loanRoute;
