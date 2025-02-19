import { Block, Page, Button, Card } from 'konsta/react';
import ConfettiExplosion from 'react-confetti-explosion';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useMint } from './provider/mint';
import { useNavigate } from 'react-router-dom';

const Container = styled(Page)`
  display: flex;
  flex-direction: column;

	.invalid-feedback {
		color: red;
	}
`;

const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 30px;
`;

const Error = ({ message, t }) => {
	return (
		<Container>
			<div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center -mb-6 font-semibold text-[1.5rem] text-center">
				{t('qrmint.mintState.error.title')}
			</div>
			<Block>
				<p className="text-center">
					{t('qrmint.mintState.error.subtitle')}
				</p>
				<Card className="text-center">{message}</Card>
				<Button
					outline
					large
					rounded
					className="mt-5"
					onClick={() => {
						window.Telegram.WebApp.openTelegramLink('https://t.me/qrmint_support');
					}}
				>
					Support
				</Button>
			</Block>
		</Container>
	);
};


const Success = ({ t }) => {
	const navigate = useNavigate();
	return (
		<Container>
			<div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center -mb-6 font-semibold text-[1.5rem] text-center">
				{t('qrmint.mintState.success.title')}
				<ConfettiExplosion />
			</div>
			<Block>
				<p className="text-center">
					{t('qrmint.mintState.success.subtitle')}
				</p>
			</Block>
			<Footer className="mx-4">
				<button
					type="submit"
					onClick={() => navigate('/')}
					className="flex text-center justify-center items-center appearance-none py-1 transition-colors focus:outline-none cursor-pointer select-none overflow-hidden z-10 w-full flex relative uppercase duration-100 font-semibold px-2 rounded text-black bg-primary active:bg-ios-primary-shade h-11"
					role="button"
					tabIndex={0}
				>
					{t('qrmint.home')}
				</button>
			</Footer>
		</Container>
	);
};

const Waiting = ({ t }) => {
	return (
		<Container>
			<div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center -mb-6 font-semibold text-[1.5rem] text-center">
				{t('qrmint.mintState.waiting.title')}
			</div>
			<Block>
				<p className="text-center">
					{t('qrmint.mintState.waiting.subtitle')}
				</p>
			</Block>
		</Container>
	);
};

export const MintState = () => {
	const { t } = useTranslation();
	const { error, success } = useMint();
	if (success) {
		return <Success t={t} />;
	} else if (error) {
		return <Error message={error} t={t} />;
	}
	return <Waiting t={t} />;
};

