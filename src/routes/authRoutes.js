import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.post("/logout", logoutUser);

export default router;
