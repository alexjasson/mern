import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Header = () => {
	const { logout, isAuthenticated } = useAuthStore();

	const handleLogout = () => {
		logout();
	};

	return (
		<div className="w-screen bg-white border-b border-gray-200">
			<div className="w-full px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-2">
					{/* Logo/Brand */}
					<Link to="/" className="flex items-center space-x-3">
						<img src="/MERN.png" alt="MERN" className="h-8 w-8" />
						<div className="text-4xl font-semibold text-black">
							mern
						</div>
					</Link>
					
					{/* Right side buttons */}
					<div className="flex space-x-3">
						{isAuthenticated ? (
							<>
								<Link
									to="/dashboard"
									className="px-4 py-2 text-gray-700 hover:text-black transition-colors border border-gray-300 rounded-md hover:border-gray-400"
								>
									Dashboard
								</Link>
								<button
									onClick={handleLogout}
									className="px-4 py-2 text-gray-700 hover:text-black transition-colors border border-gray-300 rounded-md hover:border-gray-400"
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									to="/signup"
									className="px-4 py-2 text-gray-700 hover:text-black transition-colors border border-gray-300 rounded-md hover:border-gray-400"
								>
									Sign up
								</Link>
								<Link
									to="/login"
									className="px-4 py-2 text-gray-700 hover:text-black transition-colors border border-gray-300 rounded-md hover:border-gray-400"
								>
									Login
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;