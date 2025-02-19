import { useTranslation } from 'react-i18next';
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import { useLocation, useNavigate } from 'react-router-dom';

import * as Konsta from 'konsta/react';
import { HiHome, HiUserGroup, HiCog8Tooth } from 'react-icons/hi2';
import type { FunctionComponent } from 'react';

export const Tabbar: FunctionComponent = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [vibrate] = useHapticFeedback();
	const { t } = useTranslation();

	const handleClick = (path: string) => {
		vibrate('heavy');
		navigate(path);
	};

	return (
		<Konsta.Tabbar className="left-0 bottom-0 fixed">
			<Konsta.TabbarLink
				icon={<HiHome className="w-[1.5rem] h-[1.5rem]" />}
				label={t('tabbar.home')}
				active={location.pathname === '/'}
				onClick={() => handleClick('/')}
			/>
			<Konsta.TabbarLink
				icon={<HiUserGroup className="w-[1.5rem] h-[1.5rem]" />}
				label={t('tabbar.partners')}
				active={location.pathname === '/partners'}
				onClick={() => handleClick('/partners')}
			/>
			<Konsta.TabbarLink
				icon={<HiCog8Tooth className="w-[1.5rem] h-[1.5rem]" />}
				label={t('tabbar.settings')}
				active={location.pathname === '/settings'}
				onClick={() => handleClick('/settings')}
			/>
		</Konsta.Tabbar>
	);
};
