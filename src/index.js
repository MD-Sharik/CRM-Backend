import express from "express";
import dbConnect from "./DB/user.db.js";
import router1 from "./Router/Authentication.route.js";
import { config } from "dotenv";
import cors from "cors";
const app = express();

config();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
    parameterLimit: 1000000,
    extended: true,
  })
);
const corsOption = {
  origin: "https://crm-eosin-six.vercel.app/signup/", // Replace with your actual frontend origin
  optionsSuccessStatus: 200,
};
app.use("/api/v1/", router1);

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

export default app;
