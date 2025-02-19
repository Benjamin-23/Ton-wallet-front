import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';

import { HiLanguage, HiArrowRightOnRectangle, HiUser } from 'react-icons/hi2';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { BlockTitle, List, MenuListItem, Page } from 'konsta/react';
import type { FunctionComponent } from 'react';

import { Tabbar } from '@/components/Tabbar';
import { useAuthStore } from '@/store/auth';
import { useWalletStore } from '@/store/wallet';

export const Settings: FunctionComponent = () => {
	const auth = useAuthStore();
	const wallet = useWalletStore();
	const navigate = useNavigate();
	const [vibrate] = useHapticFeedback();
	const { t } = useTranslation();

	const handleLogout = async () => {
		vibrate('heavy');
		await auth.logout();
		wallet.disconnect();
		navigate('/');
	};

	return (
		<Page>
			<BackButton
				onClick={() => {
					vibrate('heavy');
					navigate('/');
				}}
			/>

			<BlockTitle>{t('settings.title')}</BlockTitle>

			<List outline strong menuList>
				<MenuListItem
					onClick={() => {
						vibrate('heavy');
						navigate('/settings/language');
					}}
					title={t('settings.menu-list.language')}
					media={<HiLanguage className="w-[1.5rem] h-[1.5rem]" />}
				/>
				<MenuListItem
					onClick={() => {
						vibrate('heavy');
						window.Telegram.WebApp.openTelegramLink('https://t.me/qrmint_support');
					}}
					title={t('settings.menu-list.support')}
					media={<HiUser className="w-[1.5rem] h-[1.5rem]" />}
				/>
				{auth.user && auth.access_token && (
					<MenuListItem
						id="buttonRootId"
						onClick={handleLogout}
						title={t('settings.menu-list.logout')}
						media={<HiArrowRightOnRectangle className="w-[1.5rem] h-[1.5rem]" />}
					/>)}
			</List>
			<Tabbar />
		</Page>
	);
};
