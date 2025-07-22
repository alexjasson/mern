const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='relative mb-6'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Icon className='size-5 text-gray-400' />
			</div>
			<input
				{...props}
				className='w-full pl-10 pr-3 py-2 bg-white rounded-md border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-black placeholder-gray-500 transition duration-200'
			/>
		</div>
	);
};
export default Input;
