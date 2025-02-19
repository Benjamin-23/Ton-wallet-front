import { apiClient } from './request';

export const getLinks = async () => {
	const res = await apiClient.get('/dynamic-links');
	return res.data.data;
};

export const createDynamicLink = async (body) => {
	const res = await apiClient.post('/dynamic-links', body);
	return res.data.data;
};

export const getDynamicLink = async (key: string) => {
	const res = await apiClient.get(`/dynamic-links/${key}`);
	return res.data.data;
};