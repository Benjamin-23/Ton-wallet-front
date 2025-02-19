import { useEffect, useState } from 'react';
import { Page } from 'konsta/react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

import { getDynamicLink } from '@/api/link';
import { useNotification } from '@/providers/notification';

export const Link = () => {
	const navigate = useNavigate();
	const { notify } = useNotification();
	const params = useParams();
	const [ url, setUrl ] = useState();

	useEffect(() => {
		const loadLink = async () => {
			try {
				const url = await getDynamicLink(params.key);
				setUrl(url);
			} catch (err) {
				notify({
					message: err?.message,
					type: 'error'
				});
			}
		};
		if (!url) {
			loadLink();
		}
	}, [url]);

	return (
		<Page>
			<BackButton onClick={() => navigate('/')} />
			<iframe
				src={url}
				width="100%" height="100%"
				allow="clipboard-read; clipboard-write"
			/>
		</Page>
	);
};