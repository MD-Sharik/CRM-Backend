import mongoose from "mongoose";

const carLoanSchema = new mongoose.Schema({
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
  documentUrl: { type: String, required: true },
});

const CarLoan = mongoose.model("CarLoan", carLoanSchema);

export default CarLoan;