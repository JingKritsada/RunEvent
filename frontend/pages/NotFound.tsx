import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound: React.FC = () => {
	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
			<h1 className="text-6xl font-bold text-brand-600 mb-4">404</h1>
			<p className="text-xl text-gray-600 mb-8">
				ขออภัย ไม่พบหน้าที่ท่านต้องการ
			</p>
			<Link to="/">
				<Button>กลับสู่หน้าหลัก</Button>
			</Link>
		</div>
	);
};

export default NotFound;
