import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
} from 'react';
import AlertModal, { AlertType } from '../components/AlertModal';

interface AlertContextType {
	showAlert: (message: string, type?: AlertType, title?: string) => void;
	showConfirm: (
		message: string,
		onConfirm: () => void,
		type?: AlertType,
		title?: string
	) => void;
	hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [type, setType] = useState<AlertType>('info');
	const [title, setTitle] = useState<string | undefined>(undefined);
	const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(
		undefined
	);

	const showAlert = useCallback(
		(message: string, type: AlertType = 'info', title?: string) => {
			setMessage(message);
			setType(type);
			setTitle(title);
			setOnConfirm(undefined);
			setIsOpen(true);
		},
		[]
	);

	const showConfirm = useCallback(
		(
			message: string,
			onConfirmCallback: () => void,
			type: AlertType = 'warning',
			title?: string
		) => {
			setMessage(message);
			setType(type);
			setTitle(title);
			setOnConfirm(() => onConfirmCallback);
			setIsOpen(true);
		},
		[]
	);

	const hideAlert = useCallback(() => {
		setIsOpen(false);
		// Delay clearing onConfirm to avoid flickering or issues during close animation if any
		setTimeout(() => setOnConfirm(undefined), 300);
	}, []);

	return (
		<AlertContext.Provider value={{ showAlert, showConfirm, hideAlert }}>
			{children}
			<AlertModal
				isOpen={isOpen}
				message={message}
				type={type}
				title={title}
				onClose={hideAlert}
				onConfirm={
					onConfirm
						? () => {
								onConfirm();
								hideAlert();
							}
						: undefined
				}
			/>
		</AlertContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => {
	const context = useContext(AlertContext);
	if (context === undefined) {
		throw new Error('useAlert must be used within an AlertProvider');
	}
	return context;
};
