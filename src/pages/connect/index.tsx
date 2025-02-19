import { useEffect, useRef, } from 'react';
import { Page, Block } from 'konsta/react';
import { useTonConnectModal, useTonConnectUI, useTonWallet, useIsConnectionRestored } from '@tonconnect/ui-react';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

import { CustomButton } from '@/components/Button';
import { generatePayload } from '@/api/wallet';
import { useStorageNavigate } from '../../hooks/index';
import { useWalletStore } from '@/store/wallet';

const payloadTTLMS = 1000 * 60 * 20;

export const Connect = () => {
	const storageNavigate = useStorageNavigate();
	const isConnectionRestored = useIsConnectionRestored();
	const { address, connect } = useWalletStore();
	const [tonConnectUI] = useTonConnectUI();
	const { open } = useTonConnectModal();
	const wallet = useTonWallet();
	const interval = useRef<ReturnType<typeof setInterval> | undefined>();

	useEffect(() => {
		if (!isConnectionRestored || address) {
			return;
		}

		clearInterval(interval.current);

		const refreshPayload = async () => {
			tonConnectUI.setConnectRequestParameters({ state: 'loading' });

			const value = await generatePayload();
			if (!value) {
				tonConnectUI.setConnectRequestParameters(null);
			} else {
				tonConnectUI.setConnectRequestParameters({ state: 'ready', value: { tonProof: value } });
			}
		};
		const walletConnect = async (wallet) => {
			if (wallet.connectItems?.tonProof && !('error' in wallet.connectItems.tonProof)) {
				try {
					await connect(wallet);
				} catch (err) {
					await tonConnectUI.disconnect();
				}
			} else {
				tonConnectUI.disconnect();
			}
		};

		if (wallet) {
			walletConnect(wallet);
		} else {
			refreshPayload();
			setInterval(refreshPayload, payloadTTLMS);
			return () => {
				clearInterval(interval.current); 
			};
		}
	}, [ wallet, isConnectionRestored, address ]);

	return (
		<Page>
			<BackButton onClick={storageNavigate.back} />
			<Block className="flex items-center justify-between flex-col py-5">
				<div style={{ height: 400 }}>
					<img src={`${process.env.CONNECT_URL}/images/tof.png`} style={{ height: 400 }} height={400} alt="" /> 
				</div>
				<div className="w-full px-2 mt-5">
					<CustomButton large onClick={open}>
					Connect
					</CustomButton>
				</div>
			</Block>
		</Page>
	);
};

export default Connect;