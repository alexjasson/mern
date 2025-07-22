import Header from "../components/Header";
import { useAuthStore } from "../store/authStore";

const DashboardPage = () => {
	const { user } = useAuthStore();

	return (
		<div className="min-h-screen bg-white">
			<Header />
			<div className="flex-1 bg-white flex items-center justify-center">
				<h1 className="text-4xl text-center">Hello {user?.username}!</h1>
			</div>
		</div>
	);
};

export default DashboardPage;