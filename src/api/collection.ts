import { apiClient } from './request';

interface MintBody {
	order_id: number;
	address?: string;
}

export const mint = async (key: string, data: MintBody) => {
	const res = await apiClient.post(`/collections/${key}/mint`, data);
	return res.data;
};

export const getCollection = async (key: string) => {
	const res = await apiClient.get(`/collections/${key}`);
	return res.data.data;
};