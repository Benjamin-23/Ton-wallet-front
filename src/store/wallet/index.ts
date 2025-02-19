import { create } from 'zustand';
import { VERSION } from '@/store/config';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { WalletState, WalletStore } from './types';
import { connect } from '../../api/wallet';
import { TonConnectUI } from '@tonconnect/ui-react';

const initialState: WalletState = {
	balance: undefined,
	address: undefined,
};

export const useWalletStore = create<WalletStore>()(
	persist(
		(set) => ({
			...initialState,
			connect: async (body) => {
				const res = await connect(body);
				set({ address: res.address });
			},
			disconnect: async () => {
				const state = useWalletStore.getState();
				if (state.connector) {
					await state.connector.disconnect(); // Call the TonConnect disconnect function
				}
				set({ address: undefined });
			},
			setTonConnector: (connector: TonConnectUI) => {
				set({ connector });
			}
		}),
		{
			name: 'wallet',
			version: VERSION,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				balance: state.balance,
				address: state.address
			}),
		}
	)
);
