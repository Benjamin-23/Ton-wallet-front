import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { App as KonstaApp, KonstaProvider } from 'konsta/react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import '@/assets/styles/index.css';
import { NotificationProvider } from './providers/notification';
import { ScannerProvider } from './providers/scanner';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<TonConnectUIProvider manifestUrl={`${process.env.CONNECT_URL}/tonconnect-manifest.json`}>
				<I18nextProvider i18n={i18next}>
					<KonstaProvider dark theme="ios">
						<KonstaApp dark safeAreas theme="ios">
							<NotificationProvider>
								<ScannerProvider>
									<App />
								</ScannerProvider>
							</NotificationProvider>
						</KonstaApp>
					</KonstaProvider>
				</I18nextProvider>
			</TonConnectUIProvider>
		</BrowserRouter>
	</StrictMode>
);
