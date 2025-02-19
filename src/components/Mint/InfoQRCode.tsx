import { Block, Button, List, ListInput, Page } from 'konsta/react';
import { BackButton, useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import { useWizardContext } from '../Wizard';
import { usePartnerStore } from '@/store/partner/settings';
import { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/wallet';
import { DynamicLinks } from '../AddDynamicLink';

const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 30px;
`;

const Contaner = styled(Page)`
  display: flex;
  flex-direction: column;

	.invalid-feedback {
		color: red;
	}
`;

export const InformQrCode = () => {
	const [ popupOpened, setPopupOpened ] = useState<boolean>(false);
	const { address } = useWalletStore();
	const { partnerLink, loadLink } = usePartnerStore();
	const { handleNext, setState, state, handlePrev } = useWizardContext();
	const {
		handleSubmit,
		setValue,
		getValues,
		formState: { errors }
	} = useForm();
	const [vibrate] = useHapticFeedback();
	const { t } = useTranslation();

	const onSubmit = (values: object) => {
		setState({ image: state.image, text: values.text });
		handleNext();
	};

	useEffect(() => {
		if (!partnerLink) {
			loadLink();
		}
	}, []);
	

	return (
		<Contaner>
			<BackButton
				onClick={() => {
					handlePrev();
					vibrate('heavy');
				}}
			/>
			<div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center -mb-6 font-semibold text-[1.5rem] text-center">
				{t('qrmint.infoQrCode.title')}
			</div>
			<Block>
				<p className="text-center">
					{t('qrmint.infoQrCode.subtitle')}
				</p>
			</Block>
			<form id="info-form" onSubmit={handleSubmit(onSubmit)}>
				<List className="mb-0" strongIos insetIos>
					<ListInput
						className="w-full"
						label={t('qrmint.infoQrCode.form.text.label')}
						type="text"
						placeholder="text or url"
						onChange={(e) => setValue('text', e.target.value, { shouldValidate: true })}
						onBlur={(e) => setValue('text', e.target.value, { shouldValidate: true })}
						value={getValues('text')}
						required
					/>
				</List>
				{errors.text && <div className="invalid-feedback pl-4">{t('qrmint.infoQrCode.form.text.error')}</div>}
			</form>
			<Block>
				<Button
					className="mb-2"
					outline rounded large
					onClick={() => setValue('text', '@' + window.Telegram.WebApp.initDataUnsafe.user.username, { shouldValidate: true })}
				>
					{t('qrmint.infoQrCode.useTelegramUsername')}
				</Button>
				<Button
					className="mb-2"
					outline rounded large
					onClick={() => setValue('text', address, { shouldValidate: true })}
				>
					{t('qrmint.infoQrCode.useTonAddress')}
				</Button>
				<Button
					outline rounded large
					disabled={!partnerLink}
					onClick={() => setValue('text', partnerLink, { shouldValidate: true })}
				>
					{t('qrmint.infoQrCode.usePartnerLink')}
				</Button>
				<Button
					outline rounded large
					onClick={() => setPopupOpened(true)}
				>
					{t('qrmint.infoQrCode.dynamicLink')}
				</Button>
			</Block>
			<Footer className="mx-4">
				<button
					type="submit"
					form="info-form"
					className="flex text-center justify-center items-center appearance-none py-1 transition-colors focus:outline-none cursor-pointer select-none overflow-hidden z-10 w-full flex relative uppercase duration-100 font-semibold px-2 rounded text-black bg-primary active:bg-ios-primary-shade h-11"
					role="button"
					tabIndex={0}
				>
					{t('qrmint.next')}
				</button>
			</Footer>
			<DynamicLinks
				t={t}
				onClose={() => setPopupOpened(false)}
				popupOpened={popupOpened}
				onSetInfo={(value: string) => setValue('text', value, { shouldValidate: true })}
			/>
		</Contaner>
	);
};
