import { fetchApi } from './api';

export const getDashboardStats = async (queryParams = '') => {
	return await fetchApi(`/users/stats${queryParams}`, { method: 'GET' });
};

export const getAllUsers = async (queryParams = '') => {
	return await fetchApi(`/users${queryParams}`, { method: 'GET' });
};

export const getUserById = async (id: string) => {
	return await fetchApi(`/users/${id}`, { method: 'GET' });
};

export const updateUserById = async (id: string, userData: any) => {
	return await fetchApi(`/users/${id}`, {
		method: 'PUT',
		body: JSON.stringify(userData),
	});
};

export const deleteUserById = async (id: string) => {
	return await fetchApi(`/users/${id}`, { method: 'DELETE' });
};
