import mongoose from "mongoose";

const personalLoanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  duration: { type: Number, required: true },
  panCardUrl: { type: String, required: true },
  aadhaar: { type: String, required: true },
  passportSizePhotoUrl: { type: String, required: true },
  salarySlipUrl: { type: String, required: true },
  bankStatementUrl: { type: String, required: true },
  officeIdUrl: { type: String, required: true },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

const PersonalLoan = mongoose.model("PersonalLoan", personalLoanSchema);

export default PersonalLoan;
