import React, { useEffect, useState, useCallback } from 'react';
import { getAllUsers, deleteUserById } from '../services/adminService';
import { User } from '../types';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import Input from '../components/Input';
import Select from '../components/Select';

const UserManagement: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		minAge: '',
		maxAge: '',
		gender: '',
		category: '',
		status: '',
		sortBy: 'bib',
		sortOrder: 'asc',
	});

	const fetchUsers = useCallback(async () => {
		setLoading(true);
		try {
			const queryParams = new URLSearchParams(filters as any).toString();
			const data = await getAllUsers(`?${queryParams}`);
			setUsers(data);
		} catch (error) {
			console.error('Failed to fetch users', error);
		} finally {
			setLoading(false);
		}
	}, [filters]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const handleFilterChange = (e: React.ChangeEvent<any>) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const handleDelete = async (id: string) => {
		if (confirm('Are you sure you want to delete this user?')) {
			try {
				await deleteUserById(id);
				fetchUsers();
			} catch (error) {
				console.error('Failed to delete user', error);
			}
		}
	};

	return (
		<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
				User Management
			</h1>

			{/* Filters */}
			<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
					<Input
						name="minAge"
						placeholder="Min Age"
						value={filters.minAge}
						onChange={handleFilterChange}
					/>
					<Input
						name="maxAge"
						placeholder="Max Age"
						value={filters.maxAge}
						onChange={handleFilterChange}
					/>
					<Select
						name="gender"
						value={filters.gender}
						onChange={handleFilterChange}
						options={[
							{ value: '', label: 'All Genders' },
							{ value: 'male', label: 'Male' },
							{ value: 'female', label: 'Female' },
						]}
					/>
					<Select
						name="category"
						value={filters.category}
						onChange={handleFilterChange}
						options={[
							{ value: '', label: 'All Categories' },
							{ value: 'funrun', label: 'Fun Run' },
							{ value: 'mini', label: 'Mini Marathon' },
							{ value: 'half', label: 'Half Marathon' },
							{ value: 'vip', label: 'VIP' },
						]}
					/>
					<Select
						name="status"
						value={filters.status}
						onChange={handleFilterChange}
						options={[
							{ value: '', label: 'All Status' },
							{ value: 'pending', label: 'Pending' },
							{ value: 'approved', label: 'Approved' },
							{ value: 'rejected', label: 'Rejected' },
						]}
					/>
					<div className="flex items-center space-x-2">
						<Select
							name="sortBy"
							value={filters.sortBy}
							onChange={handleFilterChange}
							options={[{ value: 'bib', label: 'Sort by BIB' }]}
						/>
						<button
							onClick={() =>
								setFilters((prev) => ({
									...prev,
									sortOrder:
										prev.sortOrder === 'asc'
											? 'desc'
											: 'asc',
								}))
							}
							className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
						>
							{filters.sortOrder === 'asc' ? (
								<ChevronUp />
							) : (
								<ChevronDown />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Users Table */}
			<div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									User
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Info
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Run Details
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{loading ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-4 text-center"
									>
										Loading...
									</td>
								</tr>
							) : users.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-4 text-center"
									>
										No users found
									</td>
								</tr>
							) : (
								users.map((user) => (
									<tr key={user.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="flex-shrink-0 h-10 w-10">
													<img
														className="h-10 w-10 rounded-full"
														src={user.profileImage}
														alt=""
													/>
												</div>
												<div className="ml-4">
													<div className="text-sm font-medium text-gray-900 dark:text-white">
														{user.firstName}{' '}
														{user.lastName}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														{user.email}
													</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900 dark:text-white">
												Age: {user.age || '-'}
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												Gender: {user.gender}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{user.hasRegisteredRun &&
											user.runDetails ? (
												<>
													<div className="text-sm text-gray-900 dark:text-white">
														BIB:{' '}
														{user.runDetails.bib ||
															'-'}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														{
															user.runDetails
																.category
														}{' '}
														(
														{
															user.runDetails
																.shirtSize
														}
														)
													</div>
												</>
											) : (
												<span className="text-sm text-gray-400">
													Not Registered
												</span>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{user.hasRegisteredRun &&
											user.runDetails ? (
												<span
													className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
														user.runDetails
															.status ===
														'approved'
															? 'bg-green-100 text-green-800'
															: user.runDetails
																		.status ===
																  'rejected'
																? 'bg-red-100 text-red-800'
																: 'bg-yellow-100 text-yellow-800'
													}`}
												>
													{user.runDetails.status}
												</span>
											) : (
												'-'
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button
												onClick={() =>
													handleDelete(user.id)
												}
												className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
											>
												<Trash2 size={18} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default UserManagement;
