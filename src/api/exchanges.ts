import { apiClient } from './request';

export const createExchange = async (name: string, body: any) => {
	const res = await apiClient.post(`/exchanges/${name}/create`, body);
	return res.data.data;
};

export const getLimit = async (name: string, body: any) => {
	const res = await apiClient.get(`/exchanges/${name}/limit?${new URLSearchParams(body).toString()}`);
	return res.data.data;
};

export const estimate = async (name: string, body: any) => {
	const res = await apiClient.get(`/exchanges/${name}/estimate?${new URLSearchParams(body).toString()}`);
	return res.data.data;
};

export const getCurrencies = async (name: string) => {
	const res = await apiClient.get(`/exchanges/${name}/currencies`);
	return res.data.data;
};