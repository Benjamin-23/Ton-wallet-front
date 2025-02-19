import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHapticFeedback, useScanQrPopup } from '@vkruglikov/react-telegram-web-app';
import { Block, Button, Card, Page, Preloader } from 'konsta/react';
import type { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';

import { Tabbar } from '@/components/Tabbar';
import { useNotification } from '@/providers/notification';
import { CustomButton } from '@/components/Button';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { mint, getCollection } from '@/api/collection';
import { useStorageNavigate } from '@/hooks';
import { useScanner } from '@/providers/scanner';
import { useWalletStore } from '@/store/wallet';
import { create, confirm } from '@/api/payments';
import { Success } from '@/components/Alert/index';

const websiteRegEx = /(https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\/[^\s]*)?)/i;
const BASE_URL = process.env.API_URL;

const statuses = {
	closed: 'closed',
	opened: 'opened',
	upcoming: 'upcoming'
};

export const Scanner: FunctionComponent = () => {
	const [ success, setSuccess ] = useState(false);
	const [connector] = useTonConnectUI();
	const { address } = useWalletStore();
	const { value: qrValue, setValue } = useScanner();
	const navigate = useNavigate();
	const storageNavigate = useStorageNavigate();
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState<string | undefined>();
	const { t } = useTranslation();
	const [ show, close ] = useScanQrPopup();
	const [ data, setData ] = useState<any>(null);
	const [vibrate] = useHapticFeedback();
	const { notify } = useNotification();

	useEffect(() => {
		if (qrValue) {
			handleScan();
		}
	}, []); // Ensure the scan is only initiated once on mount

	const handleScan = () => {
		vibrate('heavy');
		try {
			show({ text: t('scanner.helper') }, (value) => {
				if (value.includes('https://app.qr-mint.net/link')) {
					navigate(value);
					return;
				}
				if (!value) return;
				setValue(value);
				close();
			});
		} catch (error) {
			console.error(error);
			notify({ type: 'error', message: t('scanner.error') });
		}
	};

	const handleCopy = (value: string) => {
		copyToClipboard(value)
			.then(() => notify({ type: 'success', message: t('scanner.copy') }))
			.catch((err) => notify({ type: 'error', message: err.message }));
	};

	if (success) {
		return (
			<Success
				title={t('qrmint.mintState.success.title')}
				subtitle={t('qrmint.mintState.success.subtitle')}
				buttonText={t('qrmint.home')}
				onClick={() => navigate('/')}
			/>
		); 
	}

	const handleMint = async (key: string) => {
		if (loading) return;
		try {
			setLoading(true);
			const paymentData = await create({
				name: 'NFT',
				amount: parseFloat(data?.mint_price.human),
				payment: 'qrmint',
				currency_token: 'ton',
				nft: true,
				address_from: address
			});
			const tonConnectResponse = await connector.sendTransaction({
				messages: paymentData.transactions.map((tx) => {
					return {
						address: tx.to,
						amount: tx.value.toString(),
						payload: tx.body,
					};
				}),
				validUntil: Date.now() + 10 * 60 * 1000,
			});
			try {
				await confirm('qrmint', paymentData.order_id, tonConnectResponse);
			} catch (err) {
				console.error(err);
				return;
			}
			await mint(key, { address, order_id: paymentData.order_id });
			// notify({ type: 'success', message: t('scanner.mintSuccess') });
			setSuccess(true);
		} catch (err) {
			notify({ type: 'error', message: (err as Error).message });
		} finally {
			setLoading(false); // Fixed loading state
		}
	};

	const loadCollection = async (key: string) => {
		if (loading) return;
		try {
			setLoading(true);
			const collection = await getCollection(key);
			const ended_at = new Date(collection.ended_at).getTime();
			const now = Date.now();
			const started_at = new Date(collection.started_at).getTime();
			collection.status = now > ended_at ? statuses.closed : now >= started_at ? statuses.opened : statuses.upcoming;
			setData(collection);
		} catch (err) {
			const message = (err as Error).message;
			setError(message);
			notify({ type: 'error', message });
		}
		setLoading(false);
	};

	const renderMintButton = (data: any, key: string) => {
		if (connector.connected) {
			//if (data?.status === statuses.opened && data?.mint_count < data?.supply) {
			if (data?.mint_count < data?.supply) {
				return (
					<Button disabled={loading} className="bg-purple-900" large onClick={() => handleMint(key)}>
						{t('scanner.mint')}
					</Button>
				);
			}
		}
		return (
			<Button outline large onClick={() => storageNavigate.push('/connect')}>
				{t('scanner.connect')}
			</Button>
		);
	};

	const renderResult = useMemo(() => {
		if (websiteRegEx.test(qrValue)) {
			return (
				<Card className="text-center mb-2">
					<a target="_blank" href={qrValue} rel="noreferrer">
						{qrValue}
					</a>
				</Card>
			);
		}
		if (error) {
			return <Card className="text-center mb-2">{error}</Card>;
		}
		const [ method, key ] = qrValue.split('_');
		if (method === 'mint') {
			if (!data && !loading) {
				loadCollection(key);
			}

			const logo = data?.images.find((image) => image.type === 'logo')?.image_url;
			return (
				<Card className="text-center mb-2 mx-0" style={{ height: '70vh' }}>
					{loading && !data ? (
						<div
							style={{ height: 400, width: '100%' }}
							className="flex justify-center items-center"
						>
							<Preloader />
						</div>
					) : (	
						<div className="mb-5">
							<img src={`${BASE_URL}/${logo}`} width={400} height={400} alt={data?.name} />
							<p className="text-2xl font-bold">{data?.name}</p>
							<div>Price: <span className="font-bold">{data?.mint_price.human} TON</span></div>
						</div>
					)}
					{renderMintButton(data, key)}
				</Card>
			);
		}

		return (
			<Card className="text-center mb-2 flex justify-center">
				{qrValue ? <div
					style={{ height: 400, width: '100%' }}
					className="flex justify-center items-center"
				>
					{qrValue}
				</div> : (
					<img
						src={`${process.env.CONNECT_URL}/images/intro.png`}
						alt="QR code scan result"
						width={400}
						height={400}
					/>
				)}
			</Card>
		);
	}, [ qrValue, t, data, connector.connected, loading, error ]);

	return (
		<Page>
			<Block>
				{renderResult}
				<Button outline large onClick={() => handleCopy(qrValue)}>
					{t('scanner.copy')}
				</Button>
				<br />
				<CustomButton large onClick={handleScan}>
					{t('scanner.open')}
				</CustomButton>
			</Block>
			<Tabbar />
		</Page>
	);
};

