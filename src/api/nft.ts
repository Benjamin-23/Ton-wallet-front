import { apiClient } from './request';

export const getCollections = async () => {
	const res = await apiClient.get('nft/collections');
	return res.data.data;
};

export const validateNFT = async (address: string) => {
	const res = await apiClient.get(`collections/q-arts/verify/${address}`);
	return res.data.ok;
};

export const getAttributes = async (text: string) => {
	const res = await apiClient.get(`nft/attributes?text=${encodeURI(text)}`);
	return res.data.data;
};

interface DateI {
	image: string;
	info: string;
	address: string;
	order_id: number;
	attributes: any[];
}

export const mint = async (data: DateI) => {
	const form = new FormData();
	form.set('image', data.image);
	form.set('info', data.info);
	form.set('order_id', data.order_id.toString());
	form.set('attributes', JSON.stringify(data.attributes));
	form.set('address', data.address);
	const res = await apiClient.post('nft/mint', form, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
	return res.data.data;
};

export const getCollection = async () => {
	const res = await apiClient.get('nft/collection');
	return res.data.data;
};
