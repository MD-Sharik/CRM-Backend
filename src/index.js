// import express from "express";
// import dbConnect from "./DB/user.db.js";
// import router1 from "./Router/Authentication.route.js";
// import { config } from "dotenv";
// import cors from "cors";
// import loanRoute from "./Router/loanRoute.route.js";

// const app = express();
// // Load environment variables
// config();
// // Middleware to parse JSON bodies
// app.use(express.json());
// // Middleware to parse URL-encoded bodies
// app.use(
//   express.urlencoded({
//     extended: true,
//     limit: "10mb",
//     parameterLimit: 1000000,
//   })
// );

// // CORS options configuration
// const corsOptions = {
//   origin: "https://crm-eosin-six.vercel.app",
//   optionsSuccessStatus: 200,
// };

// // Apply CORS middleware globally
// app.use(cors(corsOptions));

// // Define routes
// app.use("/api/v1/", router1);
// app.use("/api/v2/", loanRoute);

// // Default route
// app.get("/", (req, res) => {
//   res.status(200).send("Welcome");
// });

// // Connect to the database and start the server
// dbConnect()
//   .then(() => {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// export default app;

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
    limit: "20mb", // Increased payload size limit to 20 MB
    parameterLimit: 1000000,
  })
);

// CORS options configuration

// Apply CORS middleware globally
app.use(cors());

// Define routes
app.use("/api/v1/", router1);
app.use("/api/v2/", loanRoute);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Bad JSON payload error handling
    res.status(400).json({ error: "Invalid JSON payload" });
  } else {
    // Other errors
    res.status(500).json({ error: "Internal server error" });
  }
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
