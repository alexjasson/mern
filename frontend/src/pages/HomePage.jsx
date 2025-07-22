import Header from "../components/Header";

const HomePage = () => {
	return (
		<div className="min-h-screen bg-white">
			<Header />
			<div className="flex-1 bg-white flex items-center justify-center">
				<h1 className="text-4xl text-center">Homepage</h1>
			</div>
		</div>
	);
};

export default HomePage;