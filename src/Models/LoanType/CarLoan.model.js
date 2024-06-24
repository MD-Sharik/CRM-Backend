import mongoose from "mongoose";
const carLoanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    referralId: {
      type: String,
      required: true,
    },
    loanType: {
      type: String,
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    duration: { type: Number, required: true },
    aadhaar: { type: String, required: true },
    drivingLicenseUrl: { type: String },
    panCardUrl: { type: String },
    otherDocumentUrl: { type: String },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CarLoan = mongoose.model("CarLoan", carLoanSchema);

export default CarLoan;
