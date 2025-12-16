export const validateEmail = (email: string): boolean => {
	const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRe.test(email);
};

export const validatePhone = (phone: string): boolean => {
	const re = /^[0-9]{9,10}$/; // Thai phone number format (9-10 digits)
	return re.test(phone);
};

export const validateName = (name: string): boolean => {
	return name.length >= 2;
};

// Basic sanitization to prevent simple XSS or SQL Injection attempts on the client side
// Note: Real SQL Injection prevention must be done on the server using parameterized queries.
export const sanitizeInput = (input: string): string => {
	if (!input) return '';
	return input
		.replace(/[;'"<>\\]/g, '') // Remove dangerous characters
		.trim();
};

export const isNumeric = (val: string): boolean => {
	return /^\d+$/.test(val);
};

export const calculateAge = (birthDate: string): string => {
	if (!birthDate) return '';
	const today = new Date();
	const birthDateObj = new Date(birthDate);
	let age = today.getFullYear() - birthDateObj.getFullYear();
	const m = today.getMonth() - birthDateObj.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
		age--;
	}
	return age.toString();
};
