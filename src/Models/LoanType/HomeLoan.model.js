import mongoose from "mongoose";

const homeLoanSchema = new mongoose.Schema({
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
  aadhaarUrl: { type: String, required: true },
  drivingLicenseUrl: { type: String, required: true },
  panCardUrl: { type: String, required: true },
  otherDocumentUrl: { type: String, required: true },
});

const HomeLoan = mongoose.model("HomeLoan", homeLoanSchema);

export default HomeLoan;
