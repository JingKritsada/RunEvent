import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react';
import { User, RunnerData } from '../types/index';
import * as UserService from '../services/userService';

interface RegisterData {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	birthDate: string;
	gender: 'male' | 'female' | '';
	password?: string;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (email: string, password?: string) => Promise<boolean>;
	register: (data: RegisterData) => Promise<void>;
	registerForRun: (data: RunnerData) => Promise<void>;
	updateProfile: (data: Partial<User>) => Promise<void>;
	deleteAccount: () => Promise<void>;
	logout: () => void;
	isLoginModalOpen: boolean;
	openLoginModal: () => void;
	closeLoginModal: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(
		localStorage.getItem('token')
	);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Initial load user profile if token exists
	useEffect(() => {
		const loadUser = async () => {
			const storedToken = localStorage.getItem('token');
			if (storedToken) {
				try {
					// Verify token and get user data
					const userData = await UserService.getProfile();
					setUser(userData);
				} catch (error) {
					console.error('Failed to load user profile', error);
					logout(); // Clear invalid token
				}
			}
		};

		loadUser();
	}, []);

	const login = async (
		email: string,
		password?: string
	): Promise<boolean> => {
		setIsLoading(true);
		try {
			const result = await UserService.login(email, password);
			if (result && result.token) {
				localStorage.setItem('token', result.token);
				setToken(result.token);
				setUser(result.user);
				setIsLoginModalOpen(false);
				return true;
			}
			return false;
		} catch (error) {
			console.error('Login failed', error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (data: RegisterData) => {
		setIsLoading(true);
		try {
			const result = await UserService.register(data);
			if (result && result.token) {
				localStorage.setItem('token', result.token);
				setToken(result.token);
				setUser(result.user);
				setIsLoginModalOpen(false);
			}
		} catch (error) {
			console.error('Registration failed', error);
			alert('Registration failed: ' + (error as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	const updateProfile = async (data: Partial<User>) => {
		if (user) {
			setIsLoading(true);
			try {
				const updatedUser = await UserService.updateProfile(
					user.id,
					data
				);
				if (updatedUser) {
					setUser(updatedUser);
				}
			} catch (error) {
				console.error('Update profile failed', error);
				alert('Failed to update profile');
			} finally {
				setIsLoading(false);
			}
		}
	};

	const registerForRun = async (data: RunnerData) => {
		if (user) {
			setIsLoading(true);
			try {
				const updatedUser = await UserService.registerForRun(
					user.id,
					data
				);
				if (updatedUser) {
					setUser(updatedUser);
				}
			} catch (error) {
				console.error('Register for run failed', error);
				alert('Failed to register for run');
			} finally {
				setIsLoading(false);
			}
		}
	};

	const deleteAccount = async () => {
		if (user) {
			setIsLoading(true);
			try {
				await UserService.deleteUser(user.id);
				logout();
			} catch (error) {
				console.error('Delete account failed', error);
				alert('Failed to delete account');
			} finally {
				setIsLoading(false);
			}
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
		setToken(null);
		window.location.href = '/'; // Force redirect to home
	};

	const openLoginModal = () => setIsLoginModalOpen(true);
	const closeLoginModal = () => setIsLoginModalOpen(false);

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				login,
				register,
				registerForRun,
				updateProfile,
				deleteAccount,
				logout,
				isLoginModalOpen,
				openLoginModal,
				closeLoginModal,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
