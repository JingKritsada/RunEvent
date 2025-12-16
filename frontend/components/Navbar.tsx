import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { user, openLoginModal } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const toggleMenu = () => setIsOpen(!isOpen);

	const isActive = (path: string) => location.pathname === path;

	// Nav items configuration
	const navItems = [
		{ name: 'หน้าแรก', path: '/' },
		{ name: 'ข้อมูลการวิ่ง', id: 'run-info' }, // Use ID for custom logic
	];

	const handleLinkClick = (e: React.MouseEvent, item: any) => {
		e.preventDefault();
		setIsOpen(false);

		if (item.path) {
			navigate(item.path);
			return;
		}

		if (item.id === 'run-info') {
			if (!user) {
				openLoginModal();
			} else {
				if (user.hasRegisteredRun) {
					navigate('/run-status');
				} else {
					navigate('/register');
				}
			}
		}
	};

	return (
		<nav className="bg-white shadow-md sticky top-0 z-40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo Section */}
					<div className="flex-shrink-0 flex items-center cursor-pointer">
						<Link to="/" className="flex items-center gap-2">
							<div className="bg-brand-600 text-white p-1.5 rounded-lg">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<span className="font-bold text-xl text-brand-800">
								CoopRun
							</span>
						</Link>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-8">
						{navItems.map((item) => (
							<a
								key={item.name}
								href={item.path || '#'}
								onClick={(e) => handleLinkClick(e, item)}
								className={`${
									(item.path && isActive(item.path)) ||
									(item.id === 'run-info' &&
										(location.pathname === '/register' ||
											location.pathname ===
												'/run-status'))
										? 'text-brand-600 border-b-2 border-brand-600'
										: 'text-gray-500 hover:text-brand-600'
								} px-1 py-2 text-sm font-medium transition-colors cursor-pointer`}
							>
								{item.name}
							</a>
						))}
					</div>

					{/* Profile Section */}
					<div className="hidden md:flex items-center">
						{user ? (
							<Link
								to="/profile"
								className="flex items-center gap-2 text-gray-700 hover:text-brand-600 transition-colors"
							>
								<span className="text-sm font-medium">
									{user.name}
								</span>
								<div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center border border-brand-200 overflow-hidden">
									{user.profileImage ? (
										<img
											src={user.profileImage}
											alt="Profile"
										/>
									) : (
										<UserIcon className="h-5 w-5 text-brand-600" />
									)}
								</div>
							</Link>
						) : (
							<button
								onClick={openLoginModal}
								className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors text-sm font-medium"
							>
								<LogIn className="w-4 h-4" />
								เข้าสู่ระบบ
							</button>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="flex items-center md:hidden">
						<button
							onClick={toggleMenu}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
						>
							{isOpen ? (
								<X className="block h-6 w-6" />
							) : (
								<Menu className="block h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="md:hidden bg-white border-t border-gray-100">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{navItems.map((item) => (
							<a
								key={item.name}
								href={item.path || '#'}
								onClick={(e) => handleLinkClick(e, item)}
								className={`${
									(item.path && isActive(item.path)) ||
									(item.id === 'run-info' &&
										(location.pathname === '/register' ||
											location.pathname ===
												'/run-status'))
										? 'bg-brand-50 text-brand-700'
										: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
								} block px-3 py-2 rounded-md text-base font-medium cursor-pointer`}
							>
								{item.name}
							</a>
						))}
					</div>
					<div className="pt-4 pb-4 border-t border-gray-200">
						<div className="px-5">
							{user ? (
								<Link
									to="/profile"
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-3"
								>
									<div className="flex-shrink-0">
										<div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center border border-brand-200">
											{user.profileImage ? (
												<img
													src={user.profileImage}
													alt="Profile"
													className="rounded-full"
												/>
											) : (
												<UserIcon className="h-6 w-6 text-brand-600" />
											)}
										</div>
									</div>
									<div className="ml-3">
										<div className="text-base font-medium leading-none text-gray-800">
											{user.name}
										</div>
										<div className="text-sm font-medium leading-none text-gray-500 mt-1">
											{user.email}
										</div>
									</div>
								</Link>
							) : (
								<button
									onClick={() => {
										openLoginModal();
										setIsOpen(false);
									}}
									className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-600 hover:bg-brand-700"
								>
									<LogIn className="w-5 h-5" />
									เข้าสู่ระบบ
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
