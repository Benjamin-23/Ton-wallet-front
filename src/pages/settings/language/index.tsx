import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '@/store/settings/settings';
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';

import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { BlockTitle, List, MenuListItem, Page } from 'konsta/react';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';


export const Language: FunctionComponent = () => {
	const navigate = useNavigate();
	const [vibrate] = useHapticFeedback();
	const { t } = useTranslation();
	const { setLanguage, language } = useSettingsStore();

	const handleSelect = (lang: string) => {
		setLanguage(lang);
		vibrate('heavy');
		navigate('/settings');
	};

	return (
		<Page>
			<BackButton
				onClick={() => {
					navigate('/settings');
					vibrate('heavy');
				}}
			/>
			<BlockTitle>{t('settings.menu-list.language')}</BlockTitle>

			<List outline strong menuList>
				<MenuListItem onClick={() => handleSelect('en')} active={language === 'en'} title={t('languages.english')} />
				<MenuListItem onClick={() => handleSelect('ru')} active={language === 'ru'} title={t('languages.russian')} />
			</List>
		</Page>
	);
};
