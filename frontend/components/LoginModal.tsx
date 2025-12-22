import React, { useState, useEffect } from 'react';
import { X, User, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import {
	validateEmail,
	validatePhone,
	validateName,
	sanitizeInput,
} from '../utils/validation';

type ModalMode = 'login' | 'register';

const LoginModal: React.FC = () => {
	const { isLoginModalOpen, closeLoginModal, login, register, isLoading } =
		useAuth();
	const [mode, setMode] = useState<ModalMode>('login');

	// Login State
	const [email, setEmail] = useState(''); // Changed from identifier to email
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState('');

	// Register State
	const [regFirstName, setRegFirstName] = useState('');
	const [regLastName, setRegLastName] = useState('');
	const [regPhone, setRegPhone] = useState('');
	const [regEmail, setRegEmail] = useState('');
	const [regBirthDate, setRegBirthDate] = useState('');
	const [regGender, setRegGender] = useState<'male' | 'female' | ''>('');
	const [regPassword, setRegPassword] = useState('');
	const [regConfirmPassword, setRegConfirmPassword] = useState('');

	// Error State
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	// Reset state when modal opens/closes
	useEffect(() => {
		if (!isLoginModalOpen) {
			setMode('login');
			setEmail('');
			setPassword('');
			setLoginError('');
			setRegFirstName('');
			setRegLastName('');
			setRegPhone('');
			setRegEmail('');
			setRegBirthDate('');
			setRegGender('');
			setRegPassword('');
			setRegConfirmPassword('');
			setErrors({});
		}
	}, [isLoginModalOpen]);

	if (!isLoginModalOpen) return null;

	const validateLoginForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!email) newErrors.email = 'กรุณากรอกอีเมล';
		else if (!validateEmail(email))
			newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';

		if (!password) newErrors.password = 'กรุณากรอกรหัสผ่าน';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateRegisterForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!regFirstName) newErrors.regFirstName = 'กรุณากรอกชื่อ';
		else if (!validateName(regFirstName))
			newErrors.regFirstName = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';

		if (!regLastName) newErrors.regLastName = 'กรุณากรอกนามสกุล';

		if (!regPhone) newErrors.regPhone = 'กรุณากรอกเบอร์โทรศัพท์';
		else if (!validatePhone(regPhone))
			newErrors.regPhone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก';

		if (!regEmail) newErrors.regEmail = 'กรุณากรอกอีเมล';
		else if (!validateEmail(regEmail))
			newErrors.regEmail = 'รูปแบบอีเมลไม่ถูกต้อง';

		if (!regBirthDate) newErrors.regBirthDate = 'กรุณาระบุวันเกิด';
		if (!regGender) newErrors.regGender = 'กรุณาระบุเพศ';

		if (!regPassword) newErrors.regPassword = 'กรุณากรอกรหัสผ่าน';
		if (regPassword !== regConfirmPassword)
			newErrors.regConfirmPassword = 'รหัสผ่านไม่ตรงกัน';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleLoginSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoginError('');
		if (validateLoginForm()) {
			const success = await login(email, password);
			if (!success) {
				setLoginError(
					'อีเมลหรือรหัสผ่านไม่ถูกต้อง (ลองใช้ user01@example.com / 12345678)'
				);
			}
		}
	};

	const handleRegisterSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validateRegisterForm()) {
			await register({
				firstName: regFirstName,
				lastName: regLastName,
				phone: regPhone,
				email: regEmail,
				birthDate: regBirthDate,
				gender: regGender as 'male' | 'female',
				password: regPassword,
			});
		}
	};

	// Helper to handle input change with sanitization
	const handleInputChange =
		(setter: React.Dispatch<React.SetStateAction<string>>) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			setter(sanitizeInput(e.target.value));
		};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up max-h-[85dvh] overflow-y-auto">
				{/* Header */}
				<div className="bg-brand-600 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center sticky top-0 z-10">
					<h2 className="text-xl font-bold text-white flex items-center gap-2">
						{mode === 'login' ? (
							<User className="w-6 h-6" />
						) : (
							<UserPlus className="w-6 h-6" />
						)}
						{mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
					</h2>
					<button
						onClick={closeLoginModal}
						className="text-white hover:bg-brand-700 p-1 rounded-full transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Body */}
				<div className="p-4 md:p-6">
					{mode === 'login' ? (
						<>
							<p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
								กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลการสมัครวิ่งของท่าน
							</p>

							{loginError && (
								<div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md text-sm flex items-start gap-2">
									<AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
									{loginError}
								</div>
							)}

							<form
								onSubmit={handleLoginSubmit}
								className="space-y-4"
							>
								<Input
									label="อีเมล"
									type="email"
									placeholder="user@example.com"
									value={email}
									onChange={handleInputChange(setEmail)}
									error={errors.email}
									required
								/>
								<Input
									label="รหัสผ่าน"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={handleInputChange(setPassword)}
									error={errors.password}
									required
								/>

								<div className="flex items-center justify-end text-sm">
									<a
										href="#"
										className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
									>
										ลืมรหัสผ่าน?
									</a>
								</div>

								<Button
									type="submit"
									fullWidth
									className="mt-4 flex justify-center"
									disabled={isLoading}
								>
									{isLoading ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										'เข้าสู่ระบบ'
									)}
								</Button>
							</form>

							<div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
								ยังไม่มีบัญชี?{' '}
								<button
									onClick={() => setMode('register')}
									className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
								>
									สมัครสมาชิก
								</button>
							</div>
						</>
					) : (
						<>
							<p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
								กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีผู้ใช้งานใหม่
							</p>

							<form
								onSubmit={handleRegisterSubmit}
								className="space-y-3 md:space-y-4"
							>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
									<Input
										label="ชื่อ"
										value={regFirstName}
										onChange={handleInputChange(
											setRegFirstName
										)}
										error={errors.regFirstName}
										required
									/>
									<Input
										label="นามสกุล"
										value={regLastName}
										onChange={handleInputChange(
											setRegLastName
										)}
										error={errors.regLastName}
										required
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
									<Input
										label="วันเกิด"
										type="date"
										value={regBirthDate}
										onChange={handleInputChange(
											setRegBirthDate
										)}
										error={errors.regBirthDate}
										required
									/>
									<Select
										label="เพศ"
										value={regGender}
										onChange={(e) =>
											setRegGender(e.target.value as any)
										}
										error={errors.regGender}
										required
									>
										<option value="">ระบุเพศ</option>
										<option value="male">ชาย</option>
										<option value="female">หญิง</option>
									</Select>
								</div>

								<Input
									label="เบอร์โทรศัพท์"
									type="tel"
									value={regPhone}
									onChange={handleInputChange(setRegPhone)}
									error={errors.regPhone}
									required
								/>
								<Input
									label="อีเมล"
									type="email"
									value={regEmail}
									onChange={handleInputChange(setRegEmail)}
									error={errors.regEmail}
									required
								/>
								<Input
									label="รหัสผ่าน"
									type="password"
									value={regPassword}
									onChange={handleInputChange(setRegPassword)}
									error={errors.regPassword}
									required
								/>
								<Input
									label="ยืนยันรหัสผ่าน"
									type="password"
									value={regConfirmPassword}
									onChange={handleInputChange(
										setRegConfirmPassword
									)}
									error={errors.regConfirmPassword}
									required
								/>

								<Button
									type="submit"
									fullWidth
									className="mt-4 flex justify-center"
									disabled={isLoading}
								>
									{isLoading ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										'ลงทะเบียน'
									)}
								</Button>
							</form>

							<div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
								มีบัญชีอยู่แล้ว?{' '}
								<button
									onClick={() => setMode('login')}
									className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
								>
									เข้าสู่ระบบ
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default LoginModal;
