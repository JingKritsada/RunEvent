import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import Button from './Button';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
	isOpen: boolean;
	type: AlertType;
	message: string;
	onClose: () => void;
	onConfirm?: () => void;
	title?: string;
	confirmText?: string;
	cancelText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	type,
	message,
	onClose,
	onConfirm,
	title,
	confirmText = 'ตกลง',
	cancelText = 'ยกเลิก',
}) => {
	if (!isOpen) return null;

	const getIcon = () => {
		switch (type) {
			case 'success':
				return <CheckCircle className="w-12 h-12 text-green-500" />;
			case 'error':
				return <AlertCircle className="w-12 h-12 text-red-500" />;
			case 'warning':
				return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
			case 'info':
			default:
				return <Info className="w-12 h-12 text-blue-500" />;
		}
	};

	const getTitle = () => {
		if (title) return title;
		switch (type) {
			case 'success':
				return 'สำเร็จ';
			case 'error':
				return 'เกิดข้อผิดพลาด';
			case 'warning':
				return 'แจ้งเตือน';
			case 'info':
			default:
				return 'ข้อมูล';
		}
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
				onClick={onClose}
			/>
			<div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all text-center">
				<button
					onClick={onClose}
					className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
				>
					<X className="w-5 h-5" />
				</button>

				<div className="flex flex-col items-center justify-center space-y-4">
					{getIcon()}
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
						{getTitle()}
					</h3>
					<p className="text-gray-500 dark:text-gray-400">
						{message}
					</p>
					<div className="flex w-full gap-3 mt-4">
						{onConfirm ? (
							<>
								<Button
									variant="outline"
									onClick={onClose}
									className="flex-1"
								>
									{cancelText}
								</Button>
								<Button onClick={onConfirm} className="flex-1">
									{confirmText}
								</Button>
							</>
						) : (
							<Button onClick={onClose} className="w-full">
								{confirmText}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AlertModal;
