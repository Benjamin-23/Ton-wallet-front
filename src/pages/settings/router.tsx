import { Route, Routes } from 'react-router-dom';
import type { FunctionComponent } from 'react';

import { Settings } from '@/pages/settings';
import { Language } from '@/pages/settings/language';

export const SettingsRouter: FunctionComponent = () => {
	return (
		<Routes>
			<Route path="/" element={<Settings />} />
			<Route path="/language" element={<Language />} />
		</Routes>
	);
};
