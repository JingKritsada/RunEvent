import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

const Input: React.FC<InputProps> = ({
	label,
	error,
	className = '',
	type = 'text',
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === 'password';

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					{label}
				</label>
			)}
			<div className="relative">
				<input
					type={
						isPassword ? (showPassword ? 'text' : 'password') : type
					}
					className={`w-full px-3 py-2 appearance-none h-[42px] ${
						props.disabled
							? 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
							: 'bg-white dark:bg-gray-800 dark:text-white'
					} dark:[color-scheme:dark] border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500 ${
						error
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'
					} ${isPassword ? 'pr-10' : ''} ${className}`}
					{...props}
				/>
				{isPassword && (
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
						tabIndex={-1} // Prevent tabbing to the eye icon separately if desired, usually better for UX to keep it reachable but not disruptive
					>
						{showPassword ? (
							<EyeOff className="h-5 w-5" aria-hidden="true" />
						) : (
							<Eye className="h-5 w-5" aria-hidden="true" />
						)}
					</button>
				)}
			</div>
			{error && (
				<p className="mt-1 text-sm text-red-600 dark:text-red-400">
					{error}
				</p>
			)}
		</div>
	);
};

export default Input;
