import { User } from "../models/userModel.js";

export const verifyEmailVerification = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		
		if (!user) {
			return res.status(401).json({ success: false, message: "User not found" });
		}

		if (!user.isVerified) {
			return res.status(403).json({ 
				success: false, 
				message: "Please verify your email before accessing this resource",
				requiresVerification: true 
			});
		}

		next();
	} catch (error) {
		console.log("Error in verifyEmailVerification ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};