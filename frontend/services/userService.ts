import { fetchApi } from './api';
import { User, RunnerData } from '../types/index';

export const login = async (
	email: string,
	password?: string
): Promise<{ user: User; token: string }> => {
	return fetchApi('/users/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	});
};

export const register = async (
	data: any
): Promise<{ user: User; token: string }> => {
	return fetchApi('/users/register', {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

export const getProfile = async (): Promise<User> => {
	return fetchApi('/users/profile', {
		method: 'GET',
	});
};

export const updateProfile = async (
	_id: string,
	data: Partial<User>
): Promise<User> => {
	return fetchApi('/users/profile', {
		method: 'PUT',
		body: JSON.stringify(data),
	});
};

export const deleteUser = async (_id: string): Promise<boolean> => {
	// Assuming backend supports delete on the profile endpoint
	await fetchApi('/users/profile', {
		method: 'DELETE',
	});
	return true;
};

export const registerForRun = async (
	userId: string,
	data: RunnerData
): Promise<User> => {
	// Assuming backend handles run registration via profile update or specific endpoint
	// Using PUT profile based on likely backend structure updates
	return fetchApi('/users/profile', {
		method: 'PUT',
		body: JSON.stringify({
			runDetails: { ...data, status: 'pending' },
			hasRegisteredRun: true,
		}),
	});
};
