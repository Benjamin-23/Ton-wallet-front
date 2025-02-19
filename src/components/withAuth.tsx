import React from 'react';

import { Connect } from '../pages/connect';
import { useWalletStore } from '@/store/wallet';
import { useTonConnectUI } from '@tonconnect/ui-react';

export const withAuth = (WrappedComponent) => {
	const WithAuthComponent = (props) => {
		const [connector] = useTonConnectUI();
		const { address } = useWalletStore();

		if (address && connector.connected) {
			return <WrappedComponent {...props} />;
		}

		return <Connect />;
	};

	WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

	return WithAuthComponent;
};

export default withAuth;