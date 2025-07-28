// controllers/authController.js
import bcrypt from "bcryptjs";
import * as crypto from "crypto";
import validator from "validator";
import { User } from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../email/sendEmail.js";

// Only expose the minimal public fields
const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  username: user.username,
  isVerified: user.isVerified,
  lastLogin: user.lastLogin,
});

// ─── SIGNUP ────────────────────────────────────────────────────────────────────
export const signup = async (req, res) => {
  const { email, password, username } = req.body;

  // 1) Basic input validation
  if (
    !validator.isEmail(email)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address" });
  }

  if (
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password must be strings" });
  }


  try {
    // 2) Prevent duplicates (no field-specific messages)
    const existing = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email or username already in use" });
    }

    // 3) Hash password & generate crypto‑secure 6‑digit code
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomInt(100000, 999999).toString();

    const user = await User.create({
      email,
      username: username.trim(),
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
    });

    // 4) Set cookie & send verification email
    generateTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);

    // 5) Return minimal user
    return res.status(201).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)){
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address" });
  }

  if (typeof password !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Password must be a string" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    return res
      .status(200)
      .json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── LOGOUT ────────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.status(200).json({ success: true });
};

// ─── CHECK AUTH ────────────────────────────────────────────────────────────────
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -__v -verificationToken -verificationTokenExpiresAt -resetPasswordToken -resetPasswordExpiresAt"
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("checkAuth error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── VERIFY EMAIL ──────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  if (!/^\d{6}$/.test(code)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid verification code" });
  }

  try {
    const user = await User.findOneAndUpdate(
      {
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() },
      },
      {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code" });
    }

    await sendWelcomeEmail(user.email, user.username);
    return res
      .status(200)
      .json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    console.error("verifyEmail error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── FORGOT PASSWORD ───────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address" });
  }

  try {
    // Always return 200 to avoid enumeration
    const user = await User.findOne({ email });
    if (user) {
      const resetToken = crypto.randomBytes(20).toString("hex");
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: Date.now() + 60 * 60 * 1000, // 1h
      });

      const clientUrl = `${process.env.CLIENT_PROTOCOL || "http"}://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`;
      await sendPasswordResetEmail(
        user.email,
        `${clientUrl}/reset-password/${resetToken}`
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "If that email is registered, you will receive a password reset link",
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── RESET PASSWORD ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (typeof password !== "string" || password.length < 6) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid new password" });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    await sendResetSuccessEmail(user.email);
    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── RESEND VERIFICATION EMAIL ─────────────────────────────────────────────────
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address" });
  }

  try {
    const user = await User.findOne({ email });

    // Always 200 to avoid enumeration
    if (!user || user.isVerified) {
      return res.status(200).json({
        success: true,
        message:
          "If your email is registered and unverified, you will receive a new verification email",
      });
    }

    const verificationToken = crypto.randomInt(100000, 999999).toString();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);
    return res
      .status(200)
      .json({ success: true, message: "Verification email resent" });
  } catch (err) {
    console.error("resendVerificationEmail error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
