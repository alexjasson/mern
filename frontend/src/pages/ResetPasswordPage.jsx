import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const { resetPassword, error, isLoading, message, clearError } = useAuthStore();

	useEffect(() => {
		return () => {
			clearError();
		};
	}, [clearError]);

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if password field is empty
		if (!password) {
			setPasswordError("Password is required");
			return;
		}

		// Validate password strength
		const validations = [
			{ test: (p) => p.length >= 6, message: "Password must be at least 6 characters long" },
			{ test: (p) => /[A-Z]/.test(p), message: "Password must contain at least one uppercase letter" },
			{ test: (p) => /[a-z]/.test(p), message: "Password must contain at least one lowercase letter" },
			{ test: (p) => /[0-9]/.test(p), message: "Password must contain at least one number" },
			{ test: (p) => /[!@#$%^&*]/.test(p), message: "Password must contain at least one special character (!@#$%^&*)" },
		];

		for (const { test, message } of validations) {
			if (!test(password)) {
				setPasswordError(message);
				return;
			}
		}

		// Clear error if validation passes
		setPasswordError("");

		try {
			await resetPassword(token, password);
			toast.success("Password reset successfully, redirecting to login page...");
			navigate("/login");
		} catch (error) {
			toast.error(error.message || "Error resetting password");
		}
	};

	return (
		<div className="min-h-screen bg-white">
			<Header />
			<div className="flex items-center justify-center py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'
				>
					<div className='p-8'>
						<h2 className='text-3xl font-bold mb-6 text-center text-black'>
							Reset Password
						</h2>

						<form onSubmit={handleSubmit}>
							<Input
								icon={Lock}
								type='password'
								placeholder='New Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<PasswordStrengthMeter password={password} />
							{(passwordError || error) && <p className='text-red-500 font-semibold mt-2'>{passwordError ? passwordError : error}</p>}
							{message && <p className='text-gray-600 text-sm mb-4'>{message}</p>}

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className='mt-5 w-full py-3 px-4 bg-black text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200'
								type='submit'
								disabled={isLoading}
							>
								{isLoading ? "Resetting..." : "Set New Password"}
							</motion.button>
						</form>
					</div>
				</motion.div>
			</div>
		</div>
	);
};
export default ResetPasswordPage;
