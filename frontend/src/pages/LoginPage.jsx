import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import Header from "../components/Header";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const navigate = useNavigate();

	const { login, isLoading, error, clearError } = useAuthStore();

	useEffect(() => {
		return () => {
			clearError();
		};
	}, [clearError]);

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		// Check whether any fields are empty
		if (!email || !password) {
			setEmailError("All fields are required");
			return;
		}
		
		// Validate email format
		if (!validateEmail(email)) {
			setEmailError("Please enter a valid email address");
			return;
		}
		
		// Clear previous email error only if validation passes
		setEmailError("");
		
		await login(email, password);
		navigate("/dashboard");
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
					Welcome Back
				</h2>

				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type='text'
						placeholder='Email Address'
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>

					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					{(emailError || error) && <p className='text-red-500 font-semibold mb-2'>{emailError ? emailError : error}</p>}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full py-3 px-4 bg-black text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className='w-6 h-6 animate-spin  mx-auto' /> : "Login"}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-50 flex justify-center border-t border-gray-200'>
				<p className='text-sm text-gray-600'>
					Don't have an account?{" "}
					<Link to='/signup' className='text-gray-600 hover:underline font-medium'>
						Sign up
					</Link>
				</p>
			</div>
				</motion.div>
			</div>
		</div>
	);
};
export default LoginPage;
