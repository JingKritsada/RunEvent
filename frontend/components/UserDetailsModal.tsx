import React from 'react';
import {
	X,
	User as UserIcon,
	Phone,
	Mail,
	Calendar,
	FileText,
	Image as ImageIcon,
	Check,
} from 'lucide-react';
import { User } from '../types';

interface UserDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onApprove: (user: User) => void;
	user: User | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
	isOpen,
	onClose,
	onApprove,
	user,
}) => {
	if (!isOpen || !user) return null;

	const runDetails = user.runDetails;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto"
			onClick={onClose}
		>
			<div
				className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<UserIcon className="w-6 h-6 text-brand-600" />
						User Details
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<div className="p-6 space-y-8">
					{/* Personal Information */}
					<section>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
							<UserIcon className="w-5 h-5 text-gray-500" />
							Personal Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="flex items-start gap-4">
								<img
									src={user.profileImage}
									alt={user.firstName}
									className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
								/>
								<div>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Full Name
									</p>
									<p className="font-medium text-gray-900 dark:text-white text-lg">
										{user.firstName} {user.lastName}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
										Role:{' '}
										<span className="capitalize">
											{user.role}
										</span>
									</p>
								</div>
							</div>
							<div className="space-y-3">
								<div>
									<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
										<Mail className="w-3 h-3" /> Email
									</p>
									<p className="font-medium text-gray-900 dark:text-white">
										{user.email}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
										<Phone className="w-3 h-3" /> Phone
									</p>
									<p className="font-medium text-gray-900 dark:text-white">
										{user.phone || '-'}
									</p>
								</div>
								<div className="flex gap-6">
									<div>
										<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
											<Calendar className="w-3 h-3" /> Age
										</p>
										<p className="font-medium text-gray-900 dark:text-white">
											{user.age || '-'} Years
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Gender
										</p>
										<p className="font-medium text-gray-900 dark:text-white capitalize">
											{user.gender || '-'}
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<hr className="border-gray-100 dark:border-gray-700" />

					{/* Run Information */}
					<section>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
							<FileText className="w-5 h-5 text-gray-500" />
							Run Registration Details
						</h3>
						{user.hasRegisteredRun && runDetails ? (
							<div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
									<div>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Category
										</p>
										<p className="font-bold text-brand-600 dark:text-brand-400 text-lg">
											{runDetails.category === 'funrun'
												? 'Fun Run 5 KM'
												: runDetails.category === 'mini'
													? 'Mini Marathon 10.5 KM'
													: runDetails.category ===
														  'half'
														? 'Half Marathon 21.1 KM'
														: runDetails.category}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											BIB Number
										</p>
										<p className="font-mono font-bold text-gray-900 dark:text-white text-xl">
											{runDetails.bib || 'Pending'}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Shirt Size
										</p>
										<p className="font-medium text-gray-900 dark:text-white">
											{runDetails.shirtSize}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Status
										</p>
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
											${
												runDetails.status === 'approved'
													? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
													: runDetails.status ===
														  'rejected'
														? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
														: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
											}`}
										>
											{runDetails.status}
										</span>
									</div>
								</div>

								{/* Payment Proof */}
								<div>
									<p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
										<ImageIcon className="w-4 h-4" />{' '}
										Payment Proof
									</p>
									{runDetails.paymentProof ? (
										<div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
											<img
												src={runDetails.paymentProof}
												alt="Payment Proof"
												className="max-w-full h-auto max-h-96 mx-auto object-contain"
											/>
										</div>
									) : (
										<div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
											<p className="text-gray-400">
												No payment proof uploaded
											</p>
										</div>
									)}
								</div>
							</div>
						) : (
							<div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
								<p className="text-gray-500 dark:text-gray-400">
									User has not registered for any run.
								</p>
							</div>
						)}
					</section>
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
					>
						Close
					</button>
					{user.hasRegisteredRun &&
						runDetails?.status !== 'approved' && (
							<button
								onClick={() => onApprove(user)}
								className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
							>
								<Check className="w-4 h-4" />
								Approve Registration
							</button>
						)}
				</div>
			</div>
		</div>
	);
};

export default UserDetailsModal;
