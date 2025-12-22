import React, { useState, useEffect } from 'react';
import { TabKey, TabItem } from '../types/index';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
	Map,
	Calendar,
	Shirt,
	Award,
	FileText,
	Phone,
	List,
	MapPin,
	Navigation,
	Facebook,
	MessageCircle,
} from 'lucide-react';
import * as DataService from '../services/dataService';

const tabs: TabItem[] = [
	{ key: TabKey.OVERVIEW, label: 'ภาพรวม' },
	{ key: TabKey.TYPES, label: 'ประเภทการวิ่ง' },
	{ key: TabKey.REWARDS, label: 'รางวัล' },
	{ key: TabKey.SHIRT, label: 'แบบเสื้อ' },
	{ key: TabKey.MAP, label: 'แผนที่' },
	{ key: TabKey.SCHEDULE, label: 'กำหนดการ' },
	{ key: TabKey.RULES, label: 'กฎระเบียบ' },
	{ key: TabKey.CONTACT, label: 'ช่องทางติดต่อ' },
];

const Home: React.FC = () => {
	const [activeTab, setActiveTab] = useState<TabKey>(TabKey.OVERVIEW);

	// State for each section
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	// State for Map Tab
	const [activeMapCategory, setActiveMapCategory] = useState<string>('mini');

	const { user, openLoginModal } = useAuth();
	const navigate = useNavigate();

	// Effect to fetch data when tab changes
	useEffect(() => {
		let isMounted = true;

		const loadTabData = async () => {
			// Note: loading is set to true in handleTabChange to prevent stale data render
			// but we set it here again for initial load or other updates
			setLoading(true);
			setData(null); // Clear previous data while loading
			let result;

			try {
				switch (activeTab) {
					case TabKey.OVERVIEW:
						result = await DataService.getOverview();
						break;
					case TabKey.TYPES:
						result = await DataService.getRunTypes();
						break;
					case TabKey.REWARDS:
						result = await DataService.getRewards();
						break;
					case TabKey.SHIRT:
						result = await DataService.getShirtData();
						break;
					case TabKey.MAP:
						result = await DataService.getMapData();
						break;
					case TabKey.SCHEDULE:
						result = await DataService.getSchedule();
						break;
					case TabKey.RULES:
						result = await DataService.getRules();
						break;
					case TabKey.CONTACT:
						result = await DataService.getContact();
						break;
				}
			} catch (error) {
				console.error('Failed to load data', error);
			}

			if (isMounted) {
				setData(result);
				setLoading(false);
			}
		};

		loadTabData();

		return () => {
			isMounted = false;
		};
	}, [activeTab]);

	const handleTabChange = (key: TabKey) => {
		if (activeTab === key) return;
		setLoading(true); // Prevent rendering stale data
		setActiveTab(key);
	};

	const handleRegisterClick = () => {
		if (!user) {
			openLoginModal();
		} else if (user.hasRegisteredRun) {
			navigate('/run-status');
		} else {
			navigate('/register');
		}
	};

	const renderContent = () => {
		if (loading) {
			return (
				<div className="flex flex-col items-center justify-center h-64 text-brand-600 dark:text-brand-400 animate-pulse">
					<div className="w-10 h-10 border-4 border-brand-200 dark:border-brand-800 border-t-brand-600 dark:border-t-brand-400 rounded-full animate-spin mb-4"></div>
					Loading data...
				</div>
			);
		}

		if (!data)
			return (
				<div className="text-center text-red-500 dark:text-red-400">
					Failed to load data.
				</div>
			);

		switch (activeTab) {
			case TabKey.OVERVIEW:
				return (
					<div className="animate-fade-in space-y-6">
						<div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg mb-6">
							<img
								src={data?.bannerUrl}
								alt="Run Banner"
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
								<h2 className="text-3xl md:text-4xl font-bold text-white text-center px-4 drop-shadow-lg">
									{data?.title}
								</h2>
							</div>
						</div>
						<p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
							{data?.description}
						</p>
						<div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
							<h3 className="font-bold text-green-800 dark:text-green-300 text-xl mb-2 flex items-center gap-2">
								<Calendar className="w-5 h-5" /> วันจัดกิจกรรม
							</h3>
							<p className="text-green-700 dark:text-green-400">
								{data?.date}
							</p>
						</div>
					</div>
				);
			case TabKey.TYPES:
				// Defensive check
				if (!Array.isArray(data)) return null;
				return (
					<div className="animate-fade-in grid md:grid-cols-3 gap-6">
						{data.map((type: any) => (
							<div
								key={type.title}
								className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
							>
								<div
									className={`${type.color} h-3 w-full`}
								></div>
								<div className="p-6 text-center">
									<h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
										{type.title}
									</h3>
									<div className="text-4xl font-extrabold text-brand-600 dark:text-brand-400 mb-4">
										{type.dist}
									</div>
									<p className="text-gray-500 dark:text-gray-400 mb-6">
										ค่าสมัคร {type.price}
									</p>
									<ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-6 text-left list-disc pl-6">
										{type.benefits?.map(
											(benefit: string, idx: number) => (
												<li key={idx}>{benefit}</li>
											)
										)}
									</ul>
								</div>
							</div>
						))}
					</div>
				);
			case TabKey.REWARDS:
				// Defensive check for object structure
				if (!data?.overall || !data?.ageGroup) return null;
				return (
					<div className="animate-fade-in text-center">
						<Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
						<h3 className="text-2xl font-bold mb-4 dark:text-white">
							รางวัลการแข่งขัน
						</h3>
						<p className="text-gray-600 dark:text-gray-300 mb-8">
							{data?.description}
						</p>
						<div className="grid md:grid-cols-2 gap-6">
							<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-yellow-400 dark:text-gray-300">
								<h4 className="font-bold text-lg mb-2 dark:text-white">
									{data?.overall?.title}
								</h4>
								<p>{data?.overall?.prize}</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-gray-300 dark:border-gray-600 dark:text-gray-300">
								<h4 className="font-bold text-lg mb-2 dark:text-white">
									{data?.ageGroup?.title}
								</h4>
								<p>{data?.ageGroup?.prize}</p>
							</div>
						</div>
					</div>
				);
			case TabKey.SHIRT:
				// Defensive check
				if (!data?.images || !data?.sizes) return null;
				return (
					<div className="animate-fade-in flex flex-col items-center">
						<h3 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white">
							<Shirt className="w-6 h-6" /> แบบเสื้อและขนาด
						</h3>
						<div className="flex flex-wrap justify-center gap-8 mb-8">
							<div className="text-center">
								<img
									src={data.images?.front}
									alt="Shirt Design"
									className="rounded-lg shadow-md w-64 h-64 object-cover mb-2"
								/>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
									ด้านหน้า
								</p>
							</div>
							<div className="text-center">
								<img
									src={data.images?.back}
									alt="Shirt Back"
									className="rounded-lg shadow-md w-64 h-64 object-cover mb-2"
								/>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
									ด้านหลัง
								</p>
							</div>
						</div>

						<div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
							<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
								<thead className="bg-gray-50 dark:bg-gray-700">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
											Size
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
											รอบอก (นิ้ว)
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
											ความยาว (นิ้ว)
										</th>
									</tr>
								</thead>
								<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
									{data.sizes &&
										Array.isArray(data.sizes) &&
										data.sizes.map((row: any) => (
											<tr key={row.size}>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
													{row.size}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
													{row.chest}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
													{row.len}
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</div>
				);
			case TabKey.MAP: {
				// Defensive check for map structure
				if (!data || !data[activeMapCategory]) return null;

				const currentRoute = data[activeMapCategory];

				return (
					<div className="animate-fade-in flex flex-col items-center">
						<h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2 dark:text-white">
							<Map className="w-6 h-6" /> เส้นทางการวิ่ง
						</h3>

						{/* Map Category Selector */}
						<div className="flex flex-wrap justify-center gap-2 mb-6">
							<Button
								onClick={() => setActiveMapCategory('funrun')}
								variant={
									activeMapCategory === 'funrun'
										? 'primary'
										: 'outline'
								}
								className="text-sm"
							>
								Fun Run 5 KM
							</Button>
							<Button
								onClick={() => setActiveMapCategory('mini')}
								variant={
									activeMapCategory === 'mini'
										? 'primary'
										: 'outline'
								}
								className="text-sm"
							>
								Mini 10.5 KM
							</Button>
							<Button
								onClick={() => setActiveMapCategory('half')}
								variant={
									activeMapCategory === 'half'
										? 'primary'
										: 'outline'
								}
								className="text-sm"
							>
								Half 21.1 KM
							</Button>
						</div>

						<div className="w-full grid md:grid-cols-2 gap-4 mb-6">
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-3">
								<div className="mt-1 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
									<MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
								</div>
								<div>
									<div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
										Start Point
									</div>
									<div className="text-lg font-bold text-gray-800 dark:text-white">
										{currentRoute.start?.name}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										Lat: {currentRoute.start?.lat}, Lng:{' '}
										{currentRoute.start?.lng}
									</div>
								</div>
							</div>
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-3">
								<div className="mt-1 bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
									<MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
								</div>
								<div>
									<div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
										Check/Turn Point
									</div>
									<div className="text-lg font-bold text-gray-800 dark:text-white">
										{currentRoute.end?.name}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										Lat: {currentRoute.end?.lat}, Lng:{' '}
										{currentRoute.end?.lng}
									</div>
								</div>
							</div>
						</div>

						<div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 relative group">
							<iframe
								width="100%"
								height="100%"
								style={{ border: 0 }}
								loading="lazy"
								allowFullScreen
								referrerPolicy="no-referrer-when-downgrade"
								// Using saddr (Start Address) and daddr (Destination Address) to show route
								src={`https://maps.google.com/maps?saddr=${currentRoute.start?.lat},${currentRoute.start?.lng}&daddr=${currentRoute.end?.lat},${currentRoute.end?.lng}&output=embed&z=13`}
							></iframe>

							<div className="absolute bottom-4 right-4">
								<a
									href={`https://www.google.com/maps/dir/?api=1&origin=${currentRoute.start?.lat},${currentRoute.start?.lng}&destination=${currentRoute.end?.lat},${currentRoute.end?.lng}`}
									target="_blank"
									rel="noreferrer"
								>
									<Button className="shadow-lg text-sm flex items-center gap-2">
										<Navigation className="w-4 h-4" />{' '}
										นำทางใน Google Maps
									</Button>
								</a>
							</div>
						</div>
					</div>
				);
			}
			case TabKey.SCHEDULE:
				// Defensive check
				if (!Array.isArray(data)) return null;
				return (
					<div className="animate-fade-in max-w-2xl mx-auto">
						<h3 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white">
							<List className="w-6 h-6" /> กำหนดการ
						</h3>
						<div className="space-y-4">
							{data.map((item: any, idx: number) => (
								<div
									key={idx}
									className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
								>
									<div className="font-bold text-brand-600 dark:text-brand-400 min-w-[80px]">
										{item.time}
									</div>
									<div className="text-gray-700 dark:text-gray-300">
										{item.event}
									</div>
								</div>
							))}
						</div>
					</div>
				);
			case TabKey.RULES:
				// Defensive check
				if (!Array.isArray(data)) return null;
				return (
					<div className="animate-fade-in max-w-3xl mx-auto space-y-4">
						<h3 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white">
							<FileText className="w-6 h-6" /> กฎกติกาการแข่งขัน
						</h3>
						<ul className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
							{data.map((rule: any, idx: number) =>
								typeof rule === 'string' ? (
									<li key={idx}>{rule}</li>
								) : null
							)}
						</ul>
					</div>
				);
			case TabKey.CONTACT:
				if (!data?.phone) return null;
				return (
					<div className="animate-fade-in max-w-2xl mx-auto">
						<h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2 dark:text-white">
							<Phone className="w-6 h-6" /> ติดต่อสอบถาม
						</h3>
						<div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
							{/* Phone */}
							<a
								href={`tel:${data?.phone?.split(' ')[0]}`}
								className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors group"
							>
								<div className="bg-brand-100 dark:bg-brand-900/30 p-3 rounded-full group-hover:bg-brand-200 dark:group-hover:bg-brand-900/50 transition-colors">
									<Phone className="w-6 h-6 text-brand-600 dark:text-brand-400" />
								</div>
								<div className="text-left">
									<div className="text-sm text-gray-500 dark:text-gray-400">
										โทรศัพท์
									</div>
									<div className="text-lg font-medium text-gray-800 dark:text-white">
										{data?.phone}
									</div>
								</div>
							</a>

							{/* Facebook */}
							<a
								href={`https://www.facebook.com/search/top?q=${data?.facebook}`}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors group"
							>
								<div className="bg-brand-100 dark:bg-brand-900/30 p-3 rounded-full group-hover:bg-brand-200 dark:group-hover:bg-brand-900/50 transition-colors">
									<Facebook className="w-6 h-6 text-brand-600 dark:text-brand-400" />
								</div>
								<div className="text-left">
									<div className="text-sm text-gray-500 dark:text-gray-400">
										Facebook Page
									</div>
									<div className="text-lg font-medium text-brand-600 dark:text-brand-400">
										{data?.facebook}
									</div>
								</div>
							</a>

							{/* Line */}
							{data?.line && (
								<a
									href={`https://line.me/ti/p/~${data.line.replace('@', '')}`}
									target="_blank"
									rel="noreferrer"
									className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors group"
								>
									<div className="bg-brand-100 dark:bg-brand-900/30 p-3 rounded-full group-hover:bg-brand-200 dark:group-hover:bg-brand-900/50 transition-colors">
										<MessageCircle className="w-6 h-6 text-brand-600 dark:text-brand-400" />
									</div>
									<div className="text-left">
										<div className="text-sm text-gray-500 dark:text-gray-400">
											Line Official
										</div>
										<div className="text-lg font-medium text-brand-600 dark:text-brand-400">
											{data.line}
										</div>
									</div>
								</a>
							)}

							{/* Address */}
							<a
								href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data?.address)}`}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors group"
							>
								<div className="bg-brand-100 dark:bg-brand-900/30 p-3 rounded-full group-hover:bg-brand-200 dark:group-hover:bg-brand-900/50 transition-colors">
									<MapPin className="w-6 h-6 text-brand-600 dark:text-brand-400" />
								</div>
								<div className="text-left">
									<div className="text-sm text-gray-500 dark:text-gray-400">
										ที่อยู่
									</div>
									<div className="text-lg font-medium text-gray-800 dark:text-white">
										{data?.address}
									</div>
								</div>
							</a>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-200">
			{/* Header Hero */}
			<div className="bg-brand-600 dark:bg-brand-800 text-white py-12 md:py-20 text-center relative overflow-hidden transition-colors duration-200">
				<div className="absolute inset-0 bg-pattern opacity-10"></div>
				<div className="relative z-10 container mx-auto px-4">
					<h1 className="text-3xl md:text-5xl font-bold mb-4">
						{data && activeTab === TabKey.OVERVIEW
							? data.title
							: 'Phitsanulok Coop Run 2024'}
					</h1>
					<p className="text-brand-100 dark:text-brand-200 text-lg mb-8 max-w-2xl mx-auto">
						วิ่งด้วยใจ ให้ด้วยรัก สานสัมพันธ์สหกรณ์พิษณุโลก
					</p>
					<Button
						onClick={handleRegisterClick}
						variant="secondary"
						className="px-8 py-3 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform"
					>
						{user?.hasRegisteredRun
							? 'ดูข้อมูลการวิ่ง'
							: 'สมัครวิ่งทันที'}
					</Button>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden min-h-[600px] transition-colors duration-200">
					{/* Tabs Navigation */}
					<div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
						<nav className="flex -mb-px" aria-label="Tabs">
							{tabs.map((tab) => (
								<button
									key={tab.key}
									onClick={() => handleTabChange(tab.key)}
									className={`${
										activeTab === tab.key
											? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30'
											: 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
									} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex-shrink-0 transition-colors duration-150 ease-in-out`}
								>
									{tab.label}
								</button>
							))}
						</nav>
					</div>

					{/* Tab Content */}
					<div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-[500px] transition-colors duration-200">
						{renderContent()}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
