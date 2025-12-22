import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import {
	User as UserIcon,
	LogOut,
	Edit2,
	Save,
	X,
	Calendar,
	Phone,
	Mail,
	UserCheck,
	Loader2,
	Trash2,
} from 'lucide-react';
import { validateEmail, validatePhone } from '../utils/validation';

const Profile: React.FC = () => {
	const { user, logout, updateProfile, deleteAccount, isLoading } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
		birthDate: '',
		gender: '' as 'male' | 'female' | '',
	});

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				phone: user.phone || '',
				email: user.email || '',
				birthDate: user.birthDate || '',
				gender: user.gender || '',
			});
		}
	}, [user]);

	if (!user) {
		return <Navigate to="/" replace />;
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		// Basic validation
		if (!formData.firstName || !formData.lastName)
			return alert('กรุณาระบุชื่อ-นามสกุล');
		if (!validatePhone(formData.phone))
			return alert('เบอร์โทรศัพท์ไม่ถูกต้อง');
		if (!validateEmail(formData.email)) return alert('อีเมลไม่ถูกต้อง');

		await updateProfile({
			firstName: formData.firstName,
			lastName: formData.lastName,
			phone: formData.phone,
			email: formData.email,
			birthDate: formData.birthDate,
			gender: formData.gender,
		});
		setIsEditing(false);
	};

	const handleCancel = () => {
		// Reset form to current user data
		setFormData({
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			phone: user.phone || '',
			email: user.email || '',
			birthDate: user.birthDate || '',
			gender: user.gender || '',
		});
		setIsEditing(false);
	};

	const handleDeleteAccount = async () => {
		if (
			confirm(
				'คุณแน่ใจหรือไม่ที่จะลบบัญชีผู้ใช้? การกระทำนี้ไม่สามารถย้อนกลับได้'
			)
		) {
			await deleteAccount();
		}
	};

	const age = user.age || '-';

	return (
		<div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
			<div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
				{/* Header Cover */}
				<div className="bg-gradient-to-r from-brand-600 to-brand-500 h-32 md:h-48 relative">
					<div className="absolute -bottom-16 left-8 md:left-12">
						<div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden shadow-lg relative group cursor-pointer">
							<img
								src={user.profileImage}
								alt={user.name}
								className="w-full h-full object-cover"
							/>
							{/* TODO: Simulated Image Upload Overlay */}
							{/* <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<Camera className="w-8 h-8 text-white" />
							</div> */}
						</div>
					</div>

					<div className="absolute top-6 right-6">
						<Button
							variant="secondary"
							onClick={logout}
							className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm flex items-center gap-2"
						>
							<LogOut className="w-4 h-4" /> ออกจากระบบ
						</Button>
					</div>
				</div>

				{/* Profile Content */}
				<div className="pt-20 px-8 pb-12">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
						<div className="mt-2">
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
								{user.name}
							</h1>
							<p className="text-gray-500 dark:text-gray-400 mt-1">
								สมาชิกสหกรณ์ออมทรัพย์ครูพิษณุโลก
							</p>
						</div>

						{!isEditing ? (
							<Button
								onClick={() => setIsEditing(true)}
								variant="outline"
								className="mt-4 md:mt-0 flex items-center gap-2"
							>
								<Edit2 className="w-4 h-4" /> แก้ไขข้อมูลส่วนตัว
							</Button>
						) : (
							<div className="flex gap-2 mt-4 md:mt-0">
								<Button
									onClick={handleCancel}
									variant="ghost"
									className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
									disabled={isLoading}
								>
									<X className="w-4 h-4" /> ยกเลิก
								</Button>
								<Button
									onClick={handleSave}
									className="flex items-center gap-2"
									disabled={isLoading}
								>
									{isLoading ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Save className="w-4 h-4" />
									)}{' '}
									บันทึกข้อมูล
								</Button>
							</div>
						)}
					</div>

					{/* Personal Info Form/Display */}
					<div className="animate-fade-in relative">
						<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
							<UserCheck className="w-6 h-6 text-brand-600 dark:text-brand-400" />{' '}
							ข้อมูลส่วนตัว
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
							{/* Name Fields */}
							{isEditing ? (
								<>
									<Input
										label="ชื่อจริง"
										name="firstName"
										value={formData.firstName}
										onChange={handleInputChange}
									/>
									<Input
										label="นามสกุล"
										name="lastName"
										value={formData.lastName}
										onChange={handleInputChange}
									/>
								</>
							) : (
								<div className="col-span-1 md:col-span-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
									<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
										ชื่อ-นามสกุล
									</div>
									<div className="font-semibold text-gray-800 dark:text-white text-lg">
										{user.firstName} {user.lastName}
									</div>
								</div>
							)}

							{/* Contact Fields */}
							{isEditing ? (
								<>
									<Input
										label="เบอร์โทรศัพท์"
										name="phone"
										value={formData.phone}
										onChange={handleInputChange}
										type="tel"
									/>
									<Input
										label="อีเมล"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										type="email"
									/>
								</>
							) : (
								<>
									<div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 flex items-start gap-3">
										<div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-brand-500 dark:text-brand-400">
											<Phone className="w-5 h-5" />
										</div>
										<div>
											<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
												เบอร์โทรศัพท์
											</div>
											<div className="font-medium text-gray-800 dark:text-white">
												{user.phone}
											</div>
										</div>
									</div>
									<div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 flex items-start gap-3">
										<div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-brand-500 dark:text-brand-400">
											<Mail className="w-5 h-5" />
										</div>
										<div>
											<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
												อีเมล
											</div>
											<div className="font-medium text-gray-800 dark:text-white">
												{user.email}
											</div>
										</div>
									</div>
								</>
							)}

							{/* Personal Details */}
							{isEditing ? (
								<>
									<Input
										label="วันเกิด"
										name="birthDate"
										type="date"
										value={formData.birthDate}
										onChange={handleInputChange}
									/>
									<Select
										label="เพศ"
										name="gender"
										value={formData.gender}
										onChange={handleInputChange}
									>
										<option value="">ระบุเพศ</option>
										<option value="male">ชาย</option>
										<option value="female">หญิง</option>
									</Select>
								</>
							) : (
								<>
									<div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 flex items-start gap-3">
										<div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-brand-500 dark:text-brand-400">
											<Calendar className="w-5 h-5" />
										</div>
										<div>
											<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
												วันเกิด (อายุ)
											</div>
											<div className="font-medium text-gray-800 dark:text-white">
												{user.birthDate
													? new Date(
															user.birthDate
														).toLocaleDateString(
															'th-TH',
															{
																year: 'numeric',
																month: 'long',
																day: 'numeric',
															}
														)
													: '-'}
												<span className="text-gray-500 dark:text-gray-400 font-normal ml-2">
													({age} ปี)
												</span>
											</div>
										</div>
									</div>
									<div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 flex items-start gap-3">
										<div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-brand-500 dark:text-brand-400">
											<UserIcon className="w-5 h-5" />
										</div>
										<div>
											<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
												เพศ
											</div>
											<div className="font-medium text-gray-800 dark:text-white">
												{user.gender === 'male'
													? 'ชาย'
													: user.gender === 'female'
														? 'หญิง'
														: '-'}
											</div>
										</div>
									</div>
								</>
							)}
						</div>

						{/* Delete Account Section */}
						{isEditing && (
							<div className="mt-12 pt-8 border-t border-red-100 dark:border-red-900/30">
								<h3 className="text-red-700 dark:text-red-400 font-bold mb-2">
									พื้นที่อันตราย
								</h3>
								<p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
									การลบบัญชีจะทำให้ข้อมูลการสมัครและประวัติทั้งหมดหายไป
									ไม่สามารถกู้คืนได้
								</p>
								<Button
									variant="ghost"
									onClick={handleDeleteAccount}
									className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-900/30 flex items-center gap-2"
								>
									<Trash2 className="w-4 h-4" /> ลบบัญชีผู้ใช้
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
