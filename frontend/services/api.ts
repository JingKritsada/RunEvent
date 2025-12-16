const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
	const token = localStorage.getItem('token');

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const config = {
		...options,
		headers,
	};

	try {
		const response = await fetch(`${API_URL}${endpoint}`, config);

		// Handle 401 Unauthorized (e.g., token expired)
		if (response.status === 401) {
			localStorage.removeItem('token');
			// Optionally redirect to login or handle session expiry
		}

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Something went wrong');
		}

		return data;
	} catch (error: any) {
		console.error('API Call Error:', error);
		throw new Error(error.message || 'Failed to connect to server');
	}
};
