import { createContext, useState } from 'react';
import type { FunctionComponent } from 'react';
import type { IScanner, ScannerProviderProps } from './types';

export const ScannerContext = createContext<IScanner>({} as IScanner);

export const ScannerProvider: FunctionComponent<ScannerProviderProps> = ({
	children,
}) => {
	const [ value, setValue ] = useState<string>('');

	return (
		<ScannerContext.Provider value={{ setValue, value }}>
			{children}
		</ScannerContext.Provider>
	);
};
