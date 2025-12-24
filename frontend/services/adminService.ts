import { fetchApi } from './api';

export const getDashboardStats = async (queryParams = '') => {
	return await fetchApi(`/admin/stats${queryParams}`, { method: 'GET' });
};

export const getAllUsers = async (queryParams = '') => {
	return await fetchApi(`/admin/users${queryParams}`, { method: 'GET' });
};

export const getUserById = async (id: string) => {
	return await fetchApi(`/admin/users/${id}`, { method: 'GET' });
};

export const updateUserById = async (id: string, userData: any) => {
	return await fetchApi(`/admin/users/${id}`, {
		method: 'PUT',
		body: JSON.stringify(userData),
	});
};

export const deleteUserById = async (id: string) => {
	return await fetchApi(`/admin/users/${id}`, { method: 'DELETE' });
};
