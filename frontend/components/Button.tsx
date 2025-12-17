import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
	fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	children,
	variant = 'primary',
	fullWidth = false,
	className = '',
	...props
}) => {
	const baseStyles =
		'px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variants = {
		primary:
			'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
		secondary:
			'bg-brand-100 text-brand-800 hover:bg-brand-200 focus:ring-brand-500',
		outline:
			'border-2 border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-500',
		ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
	};

	const widthClass = fullWidth ? 'w-full' : '';

	return (
		<button
			className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
