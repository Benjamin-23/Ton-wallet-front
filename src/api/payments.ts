import { apiClient } from './request';

export const create = async ({ payment, ...body }) => {
	const res = await apiClient.post(`/payments/${payment}/create`, body);
	return res.data.data;
};

export const confirm = async (payment, id, body) => {
	const res = await apiClient.post(`/payments/${payment}/confirm/${id}`, body);
	return res.data.data;
};

export const orders = async (payment) => {
	const res = await apiClient.get(`/payments/${payment}/orders`);
	return res.data.data;
};