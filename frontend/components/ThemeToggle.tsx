import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
	const { theme, setTheme } = useTheme();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const getIcon = () => {
		switch (theme) {
			case 'light':
				return <Sun className="w-5 h-5" />;
			case 'dark':
				return <Moon className="w-5 h-5" />;
			case 'system':
				return <Monitor className="w-5 h-5" />;
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
				aria-label="Toggle theme"
			>
				{getIcon()}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
					<button
						onClick={() => {
							setTheme('light');
							setIsOpen(false);
						}}
						className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
							theme === 'light'
								? 'text-brand-600 dark:text-brand-400'
								: 'text-gray-700 dark:text-gray-300'
						}`}
					>
						<Sun className="w-4 h-4" />
						<span>Light</span>
					</button>
					<button
						onClick={() => {
							setTheme('dark');
							setIsOpen(false);
						}}
						className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
							theme === 'dark'
								? 'text-brand-600 dark:text-brand-400'
								: 'text-gray-700 dark:text-gray-300'
						}`}
					>
						<Moon className="w-4 h-4" />
						<span>Dark</span>
					</button>
					<button
						onClick={() => {
							setTheme('system');
							setIsOpen(false);
						}}
						className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
							theme === 'system'
								? 'text-brand-600 dark:text-brand-400'
								: 'text-gray-700 dark:text-gray-300'
						}`}
					>
						<Monitor className="w-4 h-4" />
						<span>System</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default ThemeToggle;
