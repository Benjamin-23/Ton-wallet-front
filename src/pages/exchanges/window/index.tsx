import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { GoCopy } from 'react-icons/go';

import { methods } from '../const';
import { formatAddress } from '@/helpers/addressFormatter';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useNotification } from '@/providers/notification';
import styled from 'styled-components';
import { Page } from 'konsta/react';
import { useSettingsStore } from '@/store/settings/settings';
import { HiCreditCard } from 'react-icons/hi';
// import styles from './page.module.scss';
const Container = styled(Page)`
	height: 100%;
	display: flex;
	flex-flow: column;

	.default_feedback {
  	padding-inline: 1.7rem;
 		text-align: left;
	}

	.copy {
  	margin-right: 5px;
  	cursor: pointer;
  	svg {
    	fill: black;
    	width: 21px;
  	  height: 21px;
	  }
	}
`;

const Wallet = styled.div`
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;

  .image {
    display: grid;
    place-items: center;

    svg {
      width: 1.5rem;
      height: 1.5rem;
      color: rgb(20, 112, 245);
    }
  }

	.info {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
  }

  .name {
    font-size: 1rem;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: -0.43px;
  }

  .balance {
    color: rgb(142, 142, 147);
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: -0.15px;
  }
`;

export const Window = () => {
	const { notify } = useNotification(); 
	const iframeRef = useRef(null);
	const params = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const { cryptoCurrency } = useSettingsStore();


	const method = methods.find((method) => method.key === params.methodName);
	const address = searchParams.get('address');

	const handleCopy = (address: string) => {
		copyToClipboard(address)
			.then(() => {
				notify({ message: t('notify.success.address.copy'), type: 'success' });
			});
	};

	return (
		<Container>
			<BackButton onClick={() => navigate(-1)} />
			<Wallet className="wallet">
				<div className="image">
					<HiCreditCard size={24} fill="#fff" />
				</div>
				<div className="info">
					<p className="name">{method.name}</p>
				</div>
				<div className="flex items-center ml-auto">
					<div className="cursor-pointer mr-1" onClick={() => handleCopy(address)}>
						<GoCopy />
					</div>
					{formatAddress(address)}
				</div>
			</Wallet>
			<iframe
				ref={iframeRef}
				src={decodeURIComponent(searchParams.get('source') || '')}
				width="100%" height="100%"
				allow="clipboard-read; clipboard-write"
			/>
		</Container>
	);
};
