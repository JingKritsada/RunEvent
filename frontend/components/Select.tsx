import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
}

const Select: React.FC<SelectProps> = ({
	label,
	error,
	className = '',
	children,
	...props
}) => {
	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					{label}
				</label>
			)}
			<div className="relative">
				<select
					className={`w-full px-3 py-2 appearance-none h-[42px] ${
						props.disabled
							? 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
							: 'bg-white dark:bg-gray-800 dark:text-white'
					} dark:[color-scheme:dark] border rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 ${
						error
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'
					} pr-10 ${className}`}
					{...props}
				>
					{children}
				</select>
				<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
					<ChevronDown
						className={`h-4 w-4 ${props.disabled ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}
					/>
				</div>
			</div>
			{error && (
				<p className="mt-1 text-sm text-red-600 dark:text-red-400">
					{error}
				</p>
			)}
		</div>
	);
};

export default Select;
