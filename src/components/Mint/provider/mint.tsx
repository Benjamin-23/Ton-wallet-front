import { createContext, useContext, useState } from 'react';

import { mint } from '@/api/nft';

interface IMintState {
  error: string | null;
	success: boolean;
  send: (data: any) => Promise<any>;
}

export const steps = {
	'save': 'save',
	'deploy': 'deploy',
	'transfer': 'transfer',
	'success': 'success'
};

export const MintContext = createContext<IMintState>({} as IMintState);

export const useMint = () => useContext<IMintState>(MintContext);

export const MintProvider = ({
	children,
}) => {
	const [ error, setError ] = useState(null);
	const [ success, setSuccess ] = useState(false);
	const send = async (data: any) => {
		try {
			await mint(data);
			setSuccess(true);
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<MintContext.Provider value={{ error, success, send }}>
			{children}
		</MintContext.Provider>
	);
};