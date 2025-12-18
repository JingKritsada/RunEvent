import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
	CheckCircle,
	Clock,
	User,
	Phone,
	Mail,
	FileText,
	Printer,
} from 'lucide-react';
import Button from '../components/Button';

const RunStatus: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate('/');
		} else if (!user.hasRegisteredRun) {
			navigate('/register');
		}
	}, [user, navigate]);

	if (!user || !user.runDetails) return null;

	const { runDetails } = user;

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'approved':
				return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
			case 'rejected':
				return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
			case 'paid':
				return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
			default:
				return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'approved':
				return 'อนุมัติแล้ว / Approved';
			case 'rejected':
				return 'ปฏิเสธ / Rejected';
			case 'paid':
				return 'ชำระเงินแล้ว / Paid';
			default:
				return 'รอตรวจสอบ / Pending Approval';
		}
	};

	const getCategoryLabel = (cat: string) => {
		if (cat === 'funrun') return 'Fun Run 5 KM';
		if (cat === 'mini') return 'Mini Marathon 10.5 KM';
		if (cat === 'half') return 'Half Marathon 21.1 KM';
		return cat;
	};

	return (
		<div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
			<div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						ข้อมูลการวิ่งและสถานะ
					</h1>
					<p className="text-gray-500 dark:text-gray-400 mt-2">
						รายละเอียดการลงทะเบียนงาน Phitsanulok Coop Run 2024
					</p>
				</div>
				<div
					className={`px-4 py-2 rounded-full border flex items-center gap-2 font-bold ${getStatusColor(runDetails.status || 'pending')}`}
				>
					{runDetails.status === 'approved' ? (
						<CheckCircle className="w-5 h-5" />
					) : (
						<Clock className="w-5 h-5" />
					)}
					{getStatusLabel(runDetails.status || 'pending')}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column: Main Info */}
				<div className="lg:col-span-2 space-y-6">
					{/* Run Details Card */}
					<div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
						<div className="bg-brand-600 dark:bg-brand-700 px-6 py-4">
							<h2 className="text-white font-bold text-lg flex items-center gap-2">
								<FileText className="w-5 h-5" /> ข้อมูลการสมัคร
								(Application Info)
							</h2>
						</div>
						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<span className="text-sm text-gray-500 dark:text-gray-400 block">
									ประเภทการวิ่ง
								</span>
								<span className="text-lg font-bold text-brand-700 dark:text-brand-400">
									{getCategoryLabel(runDetails.category)}
								</span>
							</div>
							<div>
								<span className="text-sm text-gray-500 dark:text-gray-400 block">
									ขนาดเสื้อ
								</span>
								<span className="text-lg font-bold text-gray-800 dark:text-white">
									{runDetails.shirtSize}
								</span>
							</div>
							<div>
								<span className="text-sm text-gray-500 dark:text-gray-400 block">
									BIB Number
								</span>
								<span className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
									{runDetails.bib || (
										<span className="text-gray-400 dark:text-gray-500 text-base font-normal italic">
											รอการจัดสรร
										</span>
									)}
								</span>
							</div>
							<div>
								<span className="text-sm text-gray-500 dark:text-gray-400 block">
									ค่าสมัคร
								</span>
								<span className="text-lg font-bold text-gray-800 dark:text-white">
									{runDetails.category === 'funrun'
										? '450'
										: runDetails.category === 'mini'
											? '550'
											: '750'}{' '}
									บาท
								</span>
							</div>
						</div>
					</div>

					{/* Personal Details Card */}
					<div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
						<div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-100 dark:border-gray-600">
							<h2 className="text-gray-800 dark:text-white font-bold text-lg flex items-center gap-2">
								<User className="w-5 h-5 text-gray-500 dark:text-gray-400" />{' '}
								ข้อมูลส่วนตัว (Personal Details)
							</h2>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
								<div>
									<span className="text-sm text-gray-500 dark:text-gray-400">
										ชื่อ-นามสกุล
									</span>
									<div className="font-medium text-gray-900 dark:text-white">
										{runDetails.firstName}{' '}
										{runDetails.lastName}
									</div>
								</div>
								<div>
									<span className="text-sm text-gray-500 dark:text-gray-400">
										อายุ / เพศ
									</span>
									<div className="font-medium text-gray-900 dark:text-white">
										{runDetails.age} ปี /{' '}
										{runDetails.gender === 'male'
											? 'ชาย'
											: 'หญิง'}
									</div>
								</div>
								<div>
									<span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
										<Phone className="w-3 h-3" />{' '}
										เบอร์โทรศัพท์
									</span>
									<div className="font-medium text-gray-900 dark:text-white">
										{runDetails.phone}
									</div>
								</div>
								<div>
									<span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
										<Mail className="w-3 h-3" /> อีเมล
									</span>
									<div className="font-medium text-gray-900 dark:text-white">
										{runDetails.email}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column: Status & Actions */}
				<div className="space-y-6">
					{/* Status Timeline / Steps */}
					<div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-100 dark:border-gray-700">
						<h3 className="font-bold text-gray-900 dark:text-white mb-4">
							สถานะการดำเนินการ
						</h3>
						<div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
							{/* Step 1: Registered */}
							<div className="relative">
								<div className="absolute -left-[21px] bg-green-500 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800"></div>
								<div className="text-sm font-bold text-green-700 dark:text-green-400">
									ลงทะเบียนสำเร็จ
								</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">
									ได้รับข้อมูลเรียบร้อยแล้ว
								</div>
							</div>

							{/* Step 2: Payment */}
							<div className="relative">
								<div
									className={`absolute -left-[21px] h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${runDetails.status !== 'pending' ? 'bg-green-500' : 'bg-yellow-400 animate-pulse'}`}
								></div>
								<div
									className={`text-sm font-bold ${runDetails.status !== 'pending' ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-white'}`}
								>
									ตรวจสอบการชำระเงิน
								</div>
								{runDetails.status === 'pending' && (
									<div className="text-xs text-yellow-600 dark:text-yellow-400">
										กำลังตรวจสอบ...
									</div>
								)}
							</div>

							{/* Step 3: Approved */}
							<div className="relative">
								<div
									className={`absolute -left-[21px] h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${runDetails.status === 'approved' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
								></div>
								<div
									className={`text-sm font-bold ${runDetails.status === 'approved' ? 'text-green-700 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
								>
									อนุมัติ / จัดสรร BIB
								</div>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-100 dark:border-gray-700">
						<h3 className="font-bold text-gray-900 dark:text-white mb-4">
							เมนูเพิ่มเติม
						</h3>
						<div className="space-y-3">
							{runDetails.status === 'approved' ? (
								<Button
									fullWidth
									className="flex items-center justify-center gap-2"
								>
									<Printer className="w-4 h-4" /> พิมพ์ E-BIB
								</Button>
							) : (
								<Button
									fullWidth
									disabled
									variant="secondary"
									className="flex items-center justify-center gap-2"
								>
									<Printer className="w-4 h-4" /> พิมพ์ E-BIB
									(รออนุมัติ)
								</Button>
							)}

							<Button
								fullWidth
								variant="outline"
								onClick={() =>
									alert('ติดต่อเจ้าหน้าที่: 055-244-666')
								}
							>
								แจ้งปัญหา / แก้ไขข้อมูล
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RunStatus;
