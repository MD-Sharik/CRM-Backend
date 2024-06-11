import CarLoan from "../../Models/LoanType/CarLoan.model.js";
import HomeLoan from "../../Models/LoanType/HomeLoan.model.js";
import PersonalLoan from "../../Models/LoanType/PersonalLoan.model.js";

// Controller function for personal loan
export const createPersonalLoan = async (req, res) => {
  try {
    const { name, email, date, amount, duration } = req.body;
    const documentUrl = req.file.secure_url;

    const newPersonalLoan = new PersonalLoan({
      name,
      email,
      date,
      amount,
      duration,
      documentUrl,
    });

    await newPersonalLoan.save();

    res.status(201).json({ message: "Personal loan created successfully" });
  } catch (error) {
    console.error("Error creating personal loan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function for home loan
export const createHomeLoan = async (req, res) => {
  try {
    const { name, email, date, amount, duration } = req.body;
    const documentUrl = req.file.secure_url;

    const newHomeLoan = new HomeLoan({
      name,
      email,
      date,
      amount,
      duration,
      documentUrl,
    });

    await newHomeLoan.save();

    res.status(201).json({ message: "Home loan created successfully" });
  } catch (error) {
    console.error("Error creating home loan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function for car loan
export const createCarLoan = async (req, res) => {
  try {
    const { name, email, date, amount, duration } = req.body;
    const documentUrl = req.file.secure_url;

    const newCarLoan = new CarLoan({
      name,
      email,
      date,
      amount,
      duration,
      documentUrl,
    });

    await newCarLoan.save();

    res.status(201).json({ message: "Car loan Applied successfully" });
  } catch (error) {
    console.error("Error Applying Car loan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
