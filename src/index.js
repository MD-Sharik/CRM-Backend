import express from "express";
import dbConnect from "./DB/user.db.js";
import router1 from "./Router/Authentication.route.js";
import { config } from "dotenv";
import cors from "cors";
import loanRoute from "./Router/loanRoute.route.js";

const app = express();
// Load environment variables
config();
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
    parameterLimit: 1000000,
  })
);

// CORS options configuration
const corsOptions = {
  origin: "https://crm-eosin-six.vercel.app",
  optionsSuccessStatus: 200,
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Define routes
app.use("/api/v1/", router1);
app.use("/api/v2/", loanRoute);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

// Connect to the database and start the server
dbConnect()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

export default app;
