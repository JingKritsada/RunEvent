import { fetchApi } from './api';
import { User, RegisterFormData } from '../types/index';

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
	await fetchApi('/users/profile', {
		method: 'DELETE',
	});
	return true;
};

export const registerForRun = async (
	_id: string,
	data: RegisterFormData
): Promise<User> => {
	return fetchApi('/users/register-run', {
		method: 'POST',
		body: JSON.stringify(data),
	});
};
