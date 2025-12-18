import React from 'react';

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
			<select
				className={`w-full px-3 py-2 bg-white dark:bg-gray-800 dark:text-white dark:[color-scheme:dark] border rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 ${
					error
						? 'border-red-500 dark:border-red-500'
						: 'border-gray-300 dark:border-gray-600'
				} ${className}`}
				{...props}
			>
				{children}
			</select>
			{error && (
				<p className="mt-1 text-sm text-red-600 dark:text-red-400">
					{error}
				</p>
			)}
		</div>
	);
};

export default Select;
