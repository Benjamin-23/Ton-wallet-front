import { create } from 'zustand';

import type { PartnerState, PartnerStore } from './types';
import { getPartnerLink } from '@/api/partner';

const initialState: PartnerState = {
	partnerLink: null,
	code: null
};

export const usePartnerStore = create<PartnerStore>()(
	(set) => ({
		...initialState,
		loadLink: async () => {
			const { link, code } = await getPartnerLink();
			set({ partnerLink: link, code });	
		},
	}),
);
