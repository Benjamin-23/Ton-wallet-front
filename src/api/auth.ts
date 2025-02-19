import { apiClient } from './request';
import { getQueryParams } from '../utils/getQueryParams';

export const auth = async (publicKey: string) => {
	const code = getQueryParams('tgWebAppStartParam');
	const paramQuery = code ? `&code=${code}` : '';
	const res = await apiClient.post(`/auth/telegram?${window.Telegram.WebApp.initData}${paramQuery}`, {}, {
		headers: {
			'x-public-key': publicKey
		}
	});
	return res.data.data;
};

export const refreshToken = async () => {
	const res = await apiClient.post('/auth/refresh');
	return res.data.data;
};

export const logout = async () => {
	const res = await apiClient.get('/auth/logout');
	return res.data.data;
};

