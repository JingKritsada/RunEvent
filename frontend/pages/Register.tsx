import React, { useState, useEffect } from 'react';
import { RegisterFormData } from '../types/index';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import {
	CheckCircle,
	ChevronRight,
	ArrowLeft,
	Upload,
	Image as ImageIcon,
	CreditCard,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRunTypes, getShirtData } from '../services/dataService';

const Register: React.FC = () => {
	const { user, registerForRun } = useAuth();
	const navigate = useNavigate();

	const [step, setStep] = useState(1);
	const [agreed, setAgreed] = useState(false);
	const [formData, setFormData] = useState<RegisterFormData>({
		firstName: '',
		lastName: '',
		age: '',
		gender: '',
		phone: '',
		email: '',
		category: '',
		shirtSize: '',
		paymentProof: '',
	});

	const [runTypes, setRunTypes] = useState<any[]>([]);
	const [shirtSizes, setShirtSizes] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const types = await getRunTypes();
				setRunTypes(types);
				const shirts = await getShirtData();
				if (shirts && shirts.sizes) {
					setShirtSizes(shirts.sizes);
				}
			} catch (error) {
				console.error('Failed to fetch dropdown data', error);
			}
		};
		fetchData();
	}, []);

	// Redirect if not logged in
	useEffect(() => {
		if (!user) {
			// If accessed directly and not logged in, we should ideally show login or redirect home.
			// Navbar handles the click check, but for direct URL access:
			navigate('/');
		} else {
			// If already registered, redirect to status page
			if (user.hasRegisteredRun) {
				navigate('/run-status');
			}

			// Prefill form
			setFormData((prev) => ({
				...prev,
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				email: user.email || '',
				phone: user.phone || '',
				gender: user.gender || '',
				age: user.age ? user.age.toString() : '',
			}));
		}
	}, [user, navigate]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			// Convert to base64 for mock storage/preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData((prev) => ({
					...prev,
					paymentProof: reader.result as string,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const nextStep = () => setStep((prev) => prev + 1);
	const prevStep = () => setStep((prev) => prev - 1);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (step === 4 && agreed && formData.paymentProof) {
			try {
				// Register logic
				await registerForRun(formData);
				alert('ลงทะเบียนและส่งหลักฐานการชำระเงินเรียบร้อยแล้ว!');
				navigate('/run-status');
			} catch (error) {
				console.error('Registration failed:', error);
				alert('เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง');
			}
		}
	};

	const isFormValid = () => {
		// Basic validation check (excluding paymentProof which is Step 4)
		return (
			formData.firstName !== '' &&
			formData.lastName !== '' &&
			formData.phone !== '' &&
			formData.email !== '' &&
			formData.category !== '' &&
			formData.shirtSize !== ''
		);
	};

	const getPrice = () => {
		const selected = runTypes.find((t) => t.title === formData.category);
		if (selected) {
			return selected.price.replace(/\D/g, '');
		}
		return '0';
	};

	const renderStepIndicator = () => (
		<div className="flex items-center justify-center mb-8">
			{[1, 2, 3, 4].map((s) => (
				<React.Fragment key={s}>
					<div
						className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors border-2 ${
							step >= s
								? 'bg-brand-600 text-white border-brand-600 dark:bg-brand-500 dark:border-brand-500'
								: 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700'
						}`}
					>
						{s}
					</div>
					{s < 4 && (
						<div
							className={`w-12 h-1 transition-colors ${step > s ? 'bg-brand-600 dark:bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}
						></div>
					)}
				</React.Fragment>
			))}
		</div>
	);

	if (!user) return null; // Or a loading state

	return (
		<div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
			<div className="text-center mb-10">
				<h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
					ลงทะเบียนวิ่ง
				</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-300">
					กรุณากรอกข้อมูลให้ครบถ้วนเพื่อสิทธิประโยชน์ของท่าน
				</p>
			</div>

			{renderStepIndicator()}

			<div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
				<form onSubmit={handleSubmit}>
					{/* Step 1: Personal Information */}
					{step === 1 && (
						<div className="space-y-6 animate-fade-in">
							<h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">
								ข้อมูลผู้สมัคร (ดึงจากบัญชีผู้ใช้)
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Input
									label="ชื่อจริง"
									name="firstName"
									value={formData.firstName}
									onChange={handleInputChange}
									required
									disabled
								/>
								<Input
									label="นามสกุล"
									name="lastName"
									value={formData.lastName}
									onChange={handleInputChange}
									required
									disabled
								/>
								<Input
									label="อายุ (คำนวณจากวันเกิด)"
									name="age"
									type="number"
									value={formData.age}
									onChange={handleInputChange}
									required
									disabled
								/>
								<Select
									label="เพศ"
									name="gender"
									value={formData.gender}
									onChange={handleInputChange}
									required
									disabled
								>
									<option value="">เลือกเพศ</option>
									<option value="male">ชาย</option>
									<option value="female">หญิง</option>
								</Select>
								<Input
									label="เบอร์โทรศัพท์"
									name="phone"
									type="tel"
									value={formData.phone}
									onChange={handleInputChange}
									required
									disabled
								/>
								<Input
									label="อีเมล"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleInputChange}
									required
									disabled
								/>
							</div>

							<h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2 mb-4 mt-8">
								ข้อมูลการแข่งขัน
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Select
									label="ประเภทการวิ่ง"
									name="category"
									value={formData.category}
									onChange={handleInputChange}
									required
								>
									<option value="">เลือกประเภท</option>
									{runTypes.map((type, index) => (
										<option key={index} value={type.title}>
											{type.title} ({type.dist}) -{' '}
											{type.price}
										</option>
									))}
								</Select>

								<Select
									label="ขนาดเสื้อ"
									name="shirtSize"
									value={formData.shirtSize}
									onChange={handleInputChange}
									required
								>
									<option value="">เลือกขนาด</option>
									{shirtSizes.map((size, index) => (
										<option key={index} value={size.size}>
											{size.size} ({size.chest}&quot;)
										</option>
									))}
								</Select>
							</div>

							<div className="flex justify-end pt-6">
								<Button
									type="button"
									onClick={nextStep}
									disabled={!isFormValid()}
									className="flex items-center gap-2"
								>
									ถัดไป <ChevronRight className="w-4 h-4" />
								</Button>
							</div>
						</div>
					)}

					{/* Step 2: Confirmation */}
					{step === 2 && (
						<div className="space-y-6 animate-fade-in">
							<h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-6">
								ตรวจสอบข้อมูล
							</h2>
							<div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4 text-sm md:text-base border border-gray-200 dark:border-gray-600">
								<div className="grid grid-cols-2 gap-4">
									<span className="text-gray-500 dark:text-gray-400">
										ชื่อ-นามสกุล:
									</span>
									<span className="font-medium text-gray-900 dark:text-white">
										{formData.firstName} {formData.lastName}
									</span>

									<span className="text-gray-500 dark:text-gray-400">
										อายุ/เพศ:
									</span>
									<span className="font-medium text-gray-900 dark:text-white">
										{formData.age} ปี /{' '}
										{formData.gender === 'male'
											? 'ชาย'
											: 'หญิง'}
									</span>

									<span className="text-gray-500 dark:text-gray-400">
										ติดต่อ:
									</span>
									<span className="font-medium text-gray-900 dark:text-white">
										{formData.phone} <br /> {formData.email}
									</span>

									<span className="text-gray-500 dark:text-gray-400">
										ประเภทวิ่ง:
									</span>
									<span className="font-medium text-brand-600 dark:text-brand-400 uppercase">
										{formData.category}
									</span>

									<span className="text-gray-500 dark:text-gray-400">
										ขนาดเสื้อ:
									</span>
									<span className="font-medium text-gray-900 dark:text-white">
										{formData.shirtSize}
									</span>

									<span className="text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-gray-600 mt-2">
										ยอดชำระ:
									</span>
									<span className="font-bold text-xl text-brand-700 dark:text-brand-400 pt-2 border-t dark:border-gray-600 mt-2">
										{getPrice()} บาท
									</span>
								</div>
							</div>

							<div className="flex justify-between pt-6">
								<Button
									type="button"
									variant="outline"
									onClick={prevStep}
									className="flex items-center gap-2"
								>
									<ArrowLeft className="w-4 h-4" /> แก้ไข
								</Button>
								<Button
									type="button"
									onClick={nextStep}
									className="flex items-center gap-2"
								>
									ยืนยันข้อมูล{' '}
									<ChevronRight className="w-4 h-4" />
								</Button>
							</div>
						</div>
					)}

					{/* Step 3: Terms & Condition */}
					{step === 3 && (
						<div className="space-y-6 animate-fade-in">
							<h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-4">
								ข้อตกลงและเงื่อนไข
							</h2>
							<div className="h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								<p className="mb-2">
									<strong>1. คุณสมบัติผู้สมัคร:</strong>{' '}
									ผู้สมัครต้องมีสุขภาพร่างกายแข็งแรง
									ไม่มีโรคประจำตัวที่เป็นอันตรายต่อการออกกำลังกายหนัก
								</p>
								<p className="mb-2">
									<strong>2. การบาดเจ็บ:</strong>{' '}
									ผู้จัดงานจะไม่รับผิดชอบต่อการบาดเจ็บ
									หรืออุบัติเหตุใดๆ
									ที่เกิดขึ้นระหว่างการแข่งขัน
									แม้ว่าจะมีการเตรียมการปฐมพยาบาลไว้ก็ตาม
								</p>
								<p className="mb-2">
									<strong>3. ทรัพย์สิน:</strong>{' '}
									ผู้จัดงานจะไม่รับผิดชอบต่อทรัพย์สินส่วนตัวที่สูญหายหรือเสียหาย
								</p>
								<p className="mb-2">
									<strong>4. ข้อมูลส่วนบุคคล:</strong>{' '}
									ยินยอมให้ผู้จัดงานใช้ภาพถ่ายและวิดีโอในการประชาสัมพันธ์
								</p>
								<p>
									ข้าพเจ้าได้อ่านและเข้าใจข้อตกลงและเงื่อนไขข้างต้นทุกประการ
									และยินดีปฏิบัติตามอย่างเคร่งครัด
								</p>
							</div>

							<label className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-800 dark:text-blue-200 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
								<input
									type="checkbox"
									checked={agreed}
									onChange={(e) =>
										setAgreed(e.target.checked)
									}
									className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
								/>
								<span className="text-sm font-medium select-none">
									ข้าพเจ้ายอมรับเงื่อนไขและข้อตกลงในการสมัครวิ่ง
								</span>
							</label>

							<div className="flex justify-between pt-6">
								<Button
									type="button"
									variant="outline"
									onClick={prevStep}
									className="flex items-center gap-2"
								>
									<ArrowLeft className="w-4 h-4" /> ย้อนกลับ
								</Button>
								<Button
									type="button"
									disabled={!agreed}
									onClick={nextStep}
									className="flex items-center gap-2"
								>
									เข้าสู่ขั้นตอนการชำระเงิน{' '}
									<ChevronRight className="w-4 h-4" />
								</Button>
							</div>
						</div>
					)}

					{/* Step 4: Payment */}
					{step === 4 && (
						<div className="space-y-8 animate-fade-in">
							<div className="text-center">
								<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
									ชำระเงินค่าสมัคร
								</h2>
								<div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 mb-1">
									{getPrice()} บาท
								</div>
								<p className="text-gray-500 dark:text-gray-400">
									กรุณาโอนเงินตามยอดดังกล่าวและแนบสลิป
								</p>
							</div>

							<div className="grid md:grid-cols-2 gap-8">
								{/* Bank Info & QR */}
								<div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col items-center">
									<h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
										<CreditCard className="w-5 h-5" />{' '}
										ช่องทางการโอนเงิน
									</h3>

									<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm w-full mb-6">
										<div className="flex items-center gap-4 mb-2">
											<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
												KTB
											</div>
											<div>
												<div className="font-bold text-gray-800 dark:text-white">
													ธนาคารกรุงไทย
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													สาขาพิษณุโลก
												</div>
											</div>
										</div>
										<div className="space-y-1 pl-16">
											<div className="text-sm text-gray-500 dark:text-gray-400">
												ชื่อบัญชี:{' '}
												<span className="text-gray-900 dark:text-white font-medium">
													สหกรณ์ออมทรัพย์ครูพิษณุโลก
													จก.
												</span>
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												เลขที่บัญชี:{' '}
												<span className="text-xl font-mono font-bold text-brand-600 dark:text-brand-400">
													999-9-99999-9
												</span>
											</div>
										</div>
									</div>

									<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col items-center">
										<img
											src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PhitsanulokCoopRunPayment"
											alt="QR Code"
											className="w-40 h-40 mb-2"
										/>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											สแกนเพื่อจ่ายเงิน
										</p>
									</div>
								</div>

								{/* Upload Proof */}
								<div className="flex flex-col">
									<h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
										<Upload className="w-5 h-5" />{' '}
										แนบหลักฐานการโอนเงิน
									</h3>

									<div className="flex-grow flex flex-col">
										<div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer relative bg-white dark:bg-gray-800 flex-grow min-h-[250px]">
											<input
												type="file"
												accept="image/*"
												className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
												onChange={handleFileChange}
											/>

											{formData.paymentProof ? (
												<div className="relative w-full h-full flex items-center justify-center">
													<img
														src={
															formData.paymentProof
														}
														alt="Preview"
														className="max-h-64 object-contain rounded shadow-sm"
													/>
													<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded">
														<span className="text-white font-medium flex items-center gap-2">
															<Upload className="w-4 h-4" />{' '}
															เปลี่ยนรูปภาพ
														</span>
													</div>
												</div>
											) : (
												<>
													<div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-4">
														<ImageIcon className="w-8 h-8 text-brand-500 dark:text-brand-400" />
													</div>
													<p className="text-gray-900 dark:text-white font-medium mb-1">
														คลิกเพื่ออัปโหลดสลิป
													</p>
													<p className="text-xs text-gray-500 dark:text-gray-400">
														รองรับไฟล์ JPG, PNG
														ขนาดไม่เกิน 5MB
													</p>
												</>
											)}
										</div>

										{formData.paymentProof && (
											<div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-2 rounded">
												<CheckCircle className="w-4 h-4" />{' '}
												แนบไฟล์เรียบร้อยแล้ว
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="flex justify-between pt-6 border-t mt-6">
								<Button
									type="button"
									variant="outline"
									onClick={prevStep}
									className="flex items-center gap-2"
								>
									<ArrowLeft className="w-4 h-4" /> ย้อนกลับ
								</Button>
								<Button
									type="submit"
									disabled={!formData.paymentProof}
									className="flex items-center gap-2 px-8"
								>
									ยืนยันการสมัคร{' '}
									<CheckCircle className="w-4 h-4" />
								</Button>
							</div>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default Register;
