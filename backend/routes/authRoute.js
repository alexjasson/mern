import express from "express";
import {
    login,
	logout,
	signup,
    checkAuth,
    verifyEmail,
	forgotPassword,
	resetPassword,
	resendVerificationEmail,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyEmailVerification } from "../middleware/verifyEmailVerification.js";

const router = express.Router();

router.get("/check-auth", verifyToken, verifyEmailVerification, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;