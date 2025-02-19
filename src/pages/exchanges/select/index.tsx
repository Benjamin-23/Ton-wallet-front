import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Page, Card } from 'konsta/react';

import { HiChevronRight } from 'react-icons/hi';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import styled from 'styled-components';

import { methods } from '../const';

const Container = styled(Page)`
  padding-block: 1rem;
  background: rgb(232, 232, 235);
  height: 100%;
`;

const ContanerButton = styled.div`
  display: flex;
  flex-flow: column;
  row-gap: 1rem;
  padding: 2rem 1rem;
`;

const ButtonCard = styled(Card)`
  .icon {
    display: grid;
  	place-items: center;

    svg {
      width: 1.5rem;
  		height: 1.5rem;
   		color: #1470f5;
    	flex-shrink: 0;
   	}
  }

  .title {
  	font-size: 1rem;
  	font-weight: 500;
    line-height: 22px;
  	letter-spacing: -0.43px;
  	text-align: left;
  }

  .subtitle {
  	font-size: 0.875rem;
  	font-weight: 400;
  	line-height: 18px;
  	letter-spacing: -0.15px;
  	text-align: left;
  }
`;

export function Select () {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleClick = (method) => {
		if (method.widget) {
			navigate(`/exchanges/window/${method.key}?source=${encodeURIComponent(method.widget)}`);
		} else {
			navigate(`/exchanges/amount/${method.key}`);
		}
	};

	return (
		<Container>
			<BackButton onClick={() => navigate('/select-deposit')} />
			<div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center -mb-6 font-semibold text-[1.5rem] mb-4">
				{t('payments.select.title')}
			</div>
			<ContanerButton>
				{methods.map((method) => (
					<ButtonCard
						key={method.key}
						className="cursor-pointer"
						onClick={() => handleClick(method)}
						margin='0'
					>
						<div className="flex justify-start items-center">
							<div className="mr-1 cursor-pointer icon">
								{method.icon || <img width={24} height={24} src={method.image} />}
							</div>
							<div>
								<p className="title">{method.name}</p>
								<p className="subtitle">{t('exchanges.select.method.subtitle', { name: method.name })}</p>
							</div>
							<div style={{ marginLeft: 'auto' }}>
								<HiChevronRight size={16} />
							</div>
						</div>
					</ButtonCard>
				))}
			</ContanerButton>
		</Container>
	);
}
