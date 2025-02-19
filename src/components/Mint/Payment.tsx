import { useEffect, useMemo, useState } from 'react';
import { Block, Button, Sheet, Toolbar, Link } from 'konsta/react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useNotification } from '@/providers/notification';
import BigNumber from 'bignumber.js';

import { getCollection } from '../../api/nft';
import { create, confirm } from '../../api/payments';
import { getBalance } from '../../api/wallet';
import { getInviter } from '@/api/partner';

export const Payment = ({ address, sheetOpened, onClose, onAfterPaid, t }) => {
	const { notify } = useNotification();
	const [ inviter, setInviter ] = useState();
	const [ loading, setLoading ] = useState(true);
	const [connector] = useTonConnectUI();
	const [ data, setData ] = useState();

	const fetchCollection = async () => {
		setLoading(true);
		try {
			const _data = await getCollection();
			setData(_data);
		} catch (err) {
			notify({
				type: 'error',
				message: (err as Error).message
			});
		}
	};

	const fetchInviter = async () => {
		try {
			const inviter = await getInviter();
			setInviter(inviter);
		} catch (err) {
			notify({
				type: 'error',
				message: (err as Error).message
			});
		}
	};
	
	useEffect(() => {
		let isMounted = true;
		const fetchData = async () => {
			setLoading(true);
			try {
				await Promise.all([ fetchCollection(), fetchInviter() ]);
			} catch (err) {
				notify({
					type: 'error',
					message: 'Ошибка при загрузке данных',
				});
			} finally {
				if (isMounted) {
					setLoading(false); // Сброс состояния загрузки
				}
			}
		};
		fetchData();
		return () => {
			isMounted = false;
		};
	}, []);


	const amount = useMemo(() => {
		return new BigNumber(data?.mint_price || 0).div(10 ** 9).toString();
	}, [data]);

	const onPayment = async () => {
		setLoading(true);		
		try {
			const balance = await getBalance(address);
			if (new BigNumber(balance).isLessThan(data.mint_price)) {
				notify({
					type: 'warning',
					message: 'Balance is not enought!'
				});
				return;
			}
			const paymentData = await create({
				name: 'QR Art NFT',
				amount: parseFloat(amount),
				payment: 'qrmint',
				currency_token: 'ton',
				address_from: address,
				nft: true,
				...(inviter ? { referral_address: inviter.address	 } : {})
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
			onAfterPaid(paymentData.order_id);
		} catch (err) {
			notify({
				type: 'error',
				message: (err as Error).message
			});
		} finally {
			setLoading(false);	
		}
	};
	
	return (
		<Sheet
			className="pb-safe w-full"
			opened={sheetOpened}
			onBackdropClick={onClose}
		>
			<Toolbar top>
				<div className="left" />
				<div className="right">
					<Link toolbar onClick={onClose}>
						{t('qrmint.close')}
					</Link>
				</div>
			</Toolbar>
			<Block>
				<p className="font-bold">
					{t('qrmint.payment.description', { amount })}
				</p>
				<div className="mt-4">
					<Button
						disabled={loading}
						outline
						onClick={onPayment}
					>
						{t('qrmint.pay', { amount })}
					</Button>
				</div>
			</Block>
		</Sheet>
	);
};