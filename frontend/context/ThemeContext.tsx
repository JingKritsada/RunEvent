import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<Theme>(() => {
		const savedTheme = localStorage.getItem('theme');
		return (savedTheme as Theme) || 'system';
	});

	useEffect(() => {
		const root = window.document.documentElement;

		const removeOldTheme = () => {
			root.classList.remove('light', 'dark');
		};

		const applyTheme = (themeToApply: 'light' | 'dark') => {
			removeOldTheme();
			root.classList.add(themeToApply);
		};

		if (theme === 'system') {
			const systemTheme = window.matchMedia(
				'(prefers-color-scheme: dark)'
			).matches
				? 'dark'
				: 'light';
			applyTheme(systemTheme);

			const mediaQuery = window.matchMedia(
				'(prefers-color-scheme: dark)'
			);
			const handleChange = (e: MediaQueryListEvent) => {
				applyTheme(e.matches ? 'dark' : 'light');
			};

			mediaQuery.addEventListener('change', handleChange);
			return () => mediaQuery.removeEventListener('change', handleChange);
		} else {
			applyTheme(theme);
		}
	}, [theme]);

	const value = {
		theme,
		setTheme: (newTheme: Theme) => {
			localStorage.setItem('theme', newTheme);
			setTheme(newTheme);
		},
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
