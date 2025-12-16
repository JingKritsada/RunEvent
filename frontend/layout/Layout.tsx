import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="flex flex-col min-h-screen font-sans">
			<Navbar />
			<main className="flex-grow bg-gray-50">{children}</main>
			<Footer />
			<LoginModal />
		</div>
	);
};

export default Layout;
