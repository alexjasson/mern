import nodemailer from "nodemailer";

export const createEtherealTransporter = async () => {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	const testAccount = await nodemailer.createTestAccount();

	// Create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: testAccount.user, // generated ethereal user
			pass: testAccount.pass, // generated ethereal password
		},
	});

	return transporter;
};

export const sender = {
	email: "noreply@mern.com",
	name: "mern",
};