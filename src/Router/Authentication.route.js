import express from "express";
import { userLogin } from "../Controller/user.controller.js";
import {
  agentLogin,
  agentSignup,
  userSignup,
} from "../Controller/agent.controller.js";
import { adminLogin, adminSignup } from "../Controller/admin.controller.js";
import verifyToken from "../Middlewares/UserAuth.middleware.js";

const router1 = express.Router();

router1.route("/user/login").post(userLogin);
router1.route("/user/signup").post(userSignup);
router1.route("/agent/login").post(agentLogin);
router1.route("/agent/signup").post(agentSignup);
router1.route("/admin/login").post(adminLogin);
router1.route("/admin/signup").post(adminSignup);

router1.get("/user/dashboard", verifyToken, (req, res) => {
  res.json(req.user);
});
router1.get("/agent/dashboard", verifyToken, (req, res) => {
  res.json(req.user);
});
router1.get("/admin/dashboard", verifyToken, (req, res) => {
  res.json(req.user);
});

export default router1;
