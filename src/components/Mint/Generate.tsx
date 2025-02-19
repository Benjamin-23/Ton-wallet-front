import { BackButton, useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import { Page, Block } from 'konsta/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { UploadImage } from '@/components/UploadImage';
import { useWizardContext } from '../Wizard';
import { CustomButton } from '../Button';

const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 30px;
`;

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
`;

export const Generate = () => {
	const { handleNext, setState, state } = useWizardContext();
	const navigate = useNavigate();
	const [vibrate] = useHapticFeedback();
	const { t } = useTranslation();

	const handleBack = async () => {
		navigate('/');
		vibrate('heavy');
	};

	const handleChange = (image) => {
		setState({ image });
	};

	return (
		<Container>
			<BackButton
				onClick={handleBack}
			/>
			<div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center -mb-6 font-semibold text-[1.5rem] text-center">
				{t('qrmint.uploadImage.title')}
			</div>
			<Block>
				<p className="text-center">
					{t('qrmint.uploadImage.subtitle')}
				</p>
			</Block>
			<Block>
				<UploadImage onChange={handleChange} />
			</Block>
			<Footer className="mx-4">
				<CustomButton disabled={!state} onClick={handleNext} large>
					{t('qrmint.next')}
				</CustomButton>
			</Footer>
		</Container>
	);
};