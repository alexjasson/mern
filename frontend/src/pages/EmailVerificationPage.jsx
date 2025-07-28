import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import Header from "../components/Header";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [isResending, setIsResending] = useState(false);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { error, isLoading, user, verifyEmail, resendVerificationEmail, clearError } = useAuthStore();

	useEffect(() => {
		// Redirect verified users to dashboard
		if (user?.isVerified) {
			navigate("/dashboard", { replace: true });
		}
	}, [user, navigate]);

	useEffect(() => {
		return () => {
			clearError();
		};
	}, [clearError]);

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			const result = await verifyEmail(verificationCode);
			
			// Ensure the user state is verified before navigating
			if (result.user && result.user.isVerified) {
				toast.success("Email verified successfully");
				navigate("/dashboard", { replace: true });
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Verification failed");
		}
	}, [code, verifyEmail, navigate]);

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit({ preventDefault: () => {} });
		}
	}, [code, handleSubmit]);

	const handleResendEmail = async () => {
		if (!user?.email) {
			toast.error("Email address not found. Please try logging in again.");
			return;
		}
		
		setIsResending(true);
		try {
			await resendVerificationEmail(user.email);
			toast.success("Verification email sent successfully!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to resend verification email");
		} finally {
			setIsResending(false);
		}
	};

	return (
		<div className="min-h-screen bg-white relative">
			<Header />
			{isLoading && (
				<div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
					<motion.div
						className='w-16 h-16 border-4 border-t-4 border-t-black border-gray-200 rounded-full'
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					/>
				</div>
			)}
			<div className="flex items-center justify-center py-12">
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden p-8'
				>
					<h2 className='text-3xl font-bold mb-6 text-center text-black'>
						Verify Your Email
					</h2>
					<p className='text-center text-gray-600 mb-6'>Enter the 6-digit code sent to your email address.</p>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='flex justify-between'>
							{code.map((digit, index) => (
								<input
									key={index}
									ref={(el) => (inputRefs.current[index] = el)}
									type='text'
									maxLength='6'
									value={digit}
									onChange={(e) => handleChange(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className='w-12 h-12 text-center text-2xl font-bold bg-white text-black border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none'
								/>
							))}
						</div>
						{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type='submit'
							disabled={isLoading || code.some((digit) => !digit)}
							className='w-full bg-black text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-50'
						>
							Verify Email
						</motion.button>
					</form>
					<div className='px-3 py-4 bg-gray-50 flex justify-center border-t border-gray-200'>
						<p className='text-sm text-gray-600'>
							Didn&apos;t receive the code?{" "}
							<button
								onClick={handleResendEmail}
								disabled={isResending}
								className='text-gray-600 hover:underline font-medium focus:outline-none disabled:opacity-50'
							>
								Resend verification email
							</button>
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
};
export default EmailVerificationPage;
