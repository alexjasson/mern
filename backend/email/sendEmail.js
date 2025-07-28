import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { createEtherealTransporter, sender } from "./emailService.js";
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, verificationToken) => {
	try {
		const transporter = await createEtherealTransporter();
		
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
		});
		console.log("Verification email sent successfully: %s", nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.error(`Error sending verification email`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendWelcomeEmail = async (email, username) => {
	try {
		const transporter = await createEtherealTransporter();
		
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Welcome to mern!",
			html: WELCOME_EMAIL_TEMPLATE.replace("{name}", username),
		});

		console.log("Welcome email sent successfully: %s", nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};

export const sendPasswordResetEmail = async (email, resetURL) => {
	try {
		const transporter = await createEtherealTransporter();
		
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
		});
		console.log("Password reset email sent successfully: %s", nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	try {
		const transporter = await createEtherealTransporter();
		
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
		});

		console.log("Password reset success email sent successfully: %s", nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};