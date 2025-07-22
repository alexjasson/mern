import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import Header from "../components/Header";

const SignUpPage = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const navigate = useNavigate();

	const { signup, error, isLoading, clearError } = useAuthStore();

	useEffect(() => {
		return () => {
			clearError();
		};
	}, [clearError]);

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleSignUp = async (e) => {
		e.preventDefault();

		// Check whether any fields are empty
		if (!username || !email || !password) {
			setEmailError("All fields are required");
			return;
		}
		
		// Validate email format
		if (!validateEmail(email)) {
			setEmailError("Please enter a valid email address");
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
				setEmailError(message);
				return;
			}
		}

		// Clear previous email error
		setEmailError("");

		await signup(email, password, username);
		navigate("/");
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
			<div className='p-8 bg-white'>
				<h2 className='text-3xl font-bold mb-6 text-center text-black'>
					Create Account
				</h2>

				<form onSubmit={handleSignUp}>
					<Input
						icon={User}
						type='text'
						placeholder='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<Input
						icon={Mail}
						type='text'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{(emailError || error) && <p className='text-red-500 font-semibold mt-2'>{emailError ? emailError : error}</p>}
					<PasswordStrengthMeter password={password} />

					<motion.button
						className='mt-5 w-full py-3 px-4 bg-black text-white 
						font-bold rounded-lg shadow-lg hover:bg-gray-800
						hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-50 flex justify-center border-t border-gray-200'>
				<p className='text-sm text-gray-600'>
					Already have an account?{" "}
					<Link to={"/login"} className='text-gray-600 hover:underline font-medium'>
						Login
					</Link>
				</p>
			</div>
				</motion.div>
			</div>
		</div>
	);
};
export default SignUpPage;
