import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/adminService';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
} from 'recharts';
import { Users, UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard: React.FC = () => {
	const [stats, setStats] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [viewType, setViewType] = useState<'all' | 'registered'>('all');

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const query =
					viewType === 'registered' ? '?type=registered' : '';
				const data = await getDashboardStats(query);
				setStats(data);
			} catch (error) {
				console.error('Failed to fetch stats', error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [viewType]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	if (!stats) {
		return <div>Error loading stats</div>;
	}

	const StatCard = ({ title, value, icon: Icon, color }: any) => (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 flex items-center">
			<div className={`p-3 rounded-full ${color} text-white mr-4`}>
				<Icon size={24} />
			</div>
			<div>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					{title}
				</p>
				<p className="text-2xl font-bold text-gray-800 dark:text-white">
					{value}
				</p>
			</div>
		</div>
	);

	const ageData = stats.ageRanges.map((item: any) => {
		let label = `${item._id}`;
		if (typeof item._id === 'number') {
			if (item._id === 0) label = '0-19';
			else if (item._id === 60) label = '60+';
			else label = `${item._id}-${item._id + 9}`;
		}
		return {
			...item,
			label,
		};
	});

	return (
		<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Dashboard
				</h1>
				<div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
					<button
						onClick={() => setViewType('all')}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
							viewType === 'all'
								? 'bg-white dark:bg-gray-600 text-brand-600 dark:text-white shadow-sm'
								: 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
						}`}
					>
						All Users
					</button>
					<button
						onClick={() => setViewType('registered')}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
							viewType === 'registered'
								? 'bg-white dark:bg-gray-600 text-brand-600 dark:text-white shadow-sm'
								: 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
						}`}
					>
						Registered Runners
					</button>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
				<StatCard
					title="Total Users"
					value={stats.totalUsers}
					icon={Users}
					color="bg-blue-500"
				/>
				<StatCard
					title="Registered Runners"
					value={stats.totalRunners}
					icon={UserCheck}
					color="bg-green-500"
				/>
				<StatCard
					title="Pending"
					value={stats.totalPending}
					icon={Clock}
					color="bg-yellow-500"
				/>
				<StatCard
					title="Approved"
					value={stats.totalApproved}
					icon={CheckCircle}
					color="bg-emerald-500"
				/>
				<StatCard
					title="Rejected"
					value={stats.totalRejected}
					icon={XCircle}
					color="bg-red-500"
				/>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Run Categories */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
						Run Categories
					</h2>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={stats.runCategories}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="_id" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar
									dataKey="count"
									fill="#8884d8"
									name="Runners"
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Shirt Sizes */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
						Shirt Sizes
					</h2>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={stats.shirtSizes}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="_id" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar
									dataKey="count"
									fill="#82ca9d"
									name="Count"
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Gender Distribution */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
						Gender Distribution
					</h2>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={stats.genders}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
									outerRadius={80}
									fill="#8884d8"
									dataKey="count"
									nameKey="_id"
								>
									{stats.genders.map(
										(entry: any, index: number) => (
											<Cell
												key={`cell-${index}`}
												fill={
													COLORS[
														index % COLORS.length
													]
												}
											/>
										)
									)}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Age Ranges */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
						Age Ranges
					</h2>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={ageData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="label" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar
									dataKey="count"
									fill="#ffc658"
									name="Runners"
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
