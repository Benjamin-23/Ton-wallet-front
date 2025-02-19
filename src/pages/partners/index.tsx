
import { Block, Button, Card, Page, Sheet, Toolbar, Link, List, ListItem, Preloader } from 'konsta/react';
import { useEffect, useState, type FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSwitchInlineQuery } from '@vkruglikov/react-telegram-web-app';

import { Tabbar } from '@/components/Tabbar';
import { useNotification } from '@/providers/notification';
import { getReferrals } from '../../api/partner';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { formatAddress } from '../../helpers/addressFormatter';
import { useAuthStore } from '@/store/auth';
import { CustomButton } from '@/components/Button';
import config from '../../config/config.json';
import { usePartnerStore } from '../../store/partner/settings';

const PartnerSheet = ({ sheetOpened, onClose, t, partnerLink, code }: {
	sheetOpened: any;
	onClose: any;
	t: any;
	partnerLink: any;
	code: any;
}) => {
	const switchInline = useSwitchInlineQuery();
	const { notify } = useNotification();

	const handleCopyPartnerLink = async () => {
		await copyToClipboard(`${config.appUrl}=${code}`);
		notify({ type: 'success', message: 'Successfully copied!' });
	};

	const handleSend = async () => {
		try {
			switchInline(`invite/${code}`, [ 'channels', 'groups', 'users' ]);
		} catch (err) {
			notify({ type: 'warning', message: err.message });
		}
	};

	return (
		<Sheet
			className="pb-safe w-full"
			opened={sheetOpened}
			onBackdropClick={onClose}
		>
			<Toolbar top>
				<div className="left" />
				<div className="right">
					<Link toolbar onClick={onClose}>
						{t('qrmint.close')}
					</Link>
				</div>
			</Toolbar>
			<Block>
				<Button
					className="mb-4"
					outline large
					onClick={handleSend}
					disabled={!partnerLink}
				>
					{t('qrmint.partners.send')}
				</Button>
				<Button
					className="mb-4"
					outline large
					onClick={handleCopyPartnerLink}
					disabled={!partnerLink}
				>
					{t('qrmint.partners.copyLink')}
				</Button>
				<Button
					outline large
					onClick={onClose}
				>
					{t('qrmint.close')}
				</Button>
			</Block>
		</Sheet>
	);
};

const PartnerPage: FunctionComponent = () => {
//	console.log(window.Telegram);
	const { partnerLink, loadLink, code } = usePartnerStore();
	const [ sheetOpened, setSheetOpened ] = useState(false);
	const { t } = useTranslation();
	const { user } = useAuthStore();
	const [ loading, setLoading ] = useState(false);
	
	const [ partners, setPartners ] = useState();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const referrals = await getReferrals();
				setPartners(referrals);
			} finally {
				setLoading(false);
			}
		};
		if (!loading) {
			fetchData();
		}
	},[]);

	useEffect(() => {
		if (!partnerLink && !code) {
			loadLink();
		}
	}, []);

	const renderItems = (partners) => {
		if (loading) return;
		else if (!partners) return;
		return partners.map((partner, index) => (
			<ListItem
				key={partner.username}
				title={`${index + 1}. ${partner.username}`}
			/>
		));
	};

	return (
		<Page>
			<div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center -mb-6 font-semibold text-[1.5rem] text-center">
				{t('qrmint.partners.title')}
			</div>
			<Block>
				<p className="text-center">
					{t('qrmint.partners.subtitle')}
				</p>
			</Block>
			<Card className="text-center">
				<div className="font-bold text-[1rem]">{user.coins} Q-CASH</div>
			</Card>
			{loading
				? <Preloader />
				: <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-200 px-4 mx-4 py-3 rounded relative text-center" role="alert">
					<span className="block sm:inline">{t('qrmint.partners.partner.warning')}</span>
				</div>
			}
			<List
				title={t('qrmint.partners.title')}
			>
				{renderItems(partners)}
			</List>
			<div className="p-4 dark:bg-ios-dark-surface-1 fixed z-20 left-1/2 bottom-0-safe transform -translate-x-1/2 z-20 w-full">
				<CustomButton
					onClick={() => setSheetOpened(true)}
					disabled={!code}
				>
					{t('qrmint.partners.inviteButton')}
				</CustomButton>
				<div style={{ height: 44 }} />
			</div>
			<PartnerSheet
				sheetOpened={sheetOpened}
				onClose={() => setSheetOpened(false)}
				t={t}
				partnerLink={partnerLink}
				code={code}
			/>
			<Tabbar />
		</Page>
	);
};

export const Partners = PartnerPage;