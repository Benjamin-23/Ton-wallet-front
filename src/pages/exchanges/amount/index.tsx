import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from 'konsta/react';
import debounce from 'lodash/debounce';
import { BackButton, useHapticFeedback, useScanQrPopup } from '@vkruglikov/react-telegram-web-app';
import { HiCreditCard } from 'react-icons/hi';

import { createExchange, getCurrencies, estimate } from '../../../api/exchanges';
import { useNotification } from '@/providers/notification';
import { getLimit } from '../../../api/exchanges';
import { methods } from '../const';
import styled from 'styled-components';
import { useSettingsStore } from '@/store/settings/settings';
import { ExchangeInput } from '@/components/Exchanges';
import { AddressInput } from '@/components/AddressInput/index';

const Container = styled(Page)`
	height: 100%;
	display: flex;
	flex-flow: column;

	.default_feedback {
  	padding-inline: 1.7rem;
 		text-align: left;
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


const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 30px;
`;

const validateAddress = (currencies: any[], address: string, cryptoCurrency: string): bool => {
	return currencies.some((currency) => {
		const [ chain, symbol ] = cryptoCurrency.split('_');
		if (currency.network === chain && currency.symbol === symbol) {
			return new RegExp(currency.validation_address).test(address); 
		}
		return false;
	});
};

export function Amount () {
	const { notify } = useNotification();
	const [vibrate] = useHapticFeedback();
	const [ show, close ] = useScanQrPopup();
	const [ cryptoCurrencies, setCryptoCurrencies ] = useState([]);
	const [ fiatCurrencies, setFiatCurrencies ] = useState([]);
	const [ limit, setLimit ] = useState(null);
	const [ estimateLoading, setEstimateLoading ] = useState(false);
	const { cryptoCurrency, fiatCurrency, setCryptoCurrency, setFiatCurrency } = useSettingsStore();

	const params = useParams<{ network: string; methodName: string }>();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const {
		handleSubmit,
		control,
		setValue,
		trigger,
		watch,
		formState: { isSubmitting, isValid, errors },
	} = useForm<{ amount_to: string; amount_from: string; address: string }>({
		mode: 'all',
	});
	const amountFrom = watch('amount_from');
	const method = methods.find((method) => method.key === params.methodName);

	// Унифицированная обработка ошибок
	const handleError = (error: unknown) => {
		notify({
			type: 'error',
			message: (error as Error)?.message || t('errors.generic'),
		});
	};

	const loadExchangeData = useCallback(async () => {
		if (!params.methodName) return;

		try {
			const [ currencies, limits ] = await Promise.all([
				getCurrencies(params.methodName),
				getLimit(params.methodName, {
					currency_to: cryptoCurrency.split('_')[1],
					currency_from: fiatCurrency,
				}),
			]);
			setCryptoCurrencies(currencies.cryptos);
			setFiatCurrencies(currencies.fiats);
			setLimit(limits);
		} catch (error) {
			handleError(error);
		}
	}, [ params.methodName, cryptoCurrency, fiatCurrency ]);

	// Дебаунс функция для вызова API
	const loadEstimate = useCallback(
		debounce(async () => {
			if (!amountFrom || estimateLoading) return;

			setEstimateLoading(true);
			try {
				const currency = cryptoCurrency.split('_')[1];
				const data = await estimate(params.methodName, {
					amount: amountFrom,
					currency_to: currency,
					currency_from: fiatCurrency,
				});
				setValue('amount_to', data);
			} catch (error) {
				handleError(error);
			} finally {
				setEstimateLoading(false);
			}
		}, 500), // 500 мс задержка
		[ amountFrom, cryptoCurrency, fiatCurrency ]
	);

	useEffect(() => {
		if (method?.key === 'simpleswap') {
			
		}
		loadExchangeData();
	}, [loadExchangeData]);

	useEffect(() => {
		trigger(); // Пройти проверку формы сразу
	}, []);
	

	const send = async ({ amount_from, address }: { amount_from: string; address: string }) => {
		if (!params.methodName) return;

		try {
			const methodName = params.methodName as 'simpleswap' | 'finchpay';
			const res = await createExchange(methodName, {
				amount: amount_from,
				currency_from: fiatCurrency,
				currency_to: cryptoCurrency.split('_')[1],
				address_to: address,
			});

			if (methodName === 'simpleswap') {
				return navigate(`/exchanges/window/${methodName}?source=${encodeURIComponent(res.url)}&address=${address}`);
			}

			window.location.href = res.url;
		} catch (error) {
			handleError(error);
		}
	};

	const handleSelectCoin = (crypto: { network: string; symbol: string }) => {
		setCryptoCurrency(`${crypto.network}_${crypto.symbol}`);
	};

	const handleOpenScanner = () => {
		vibrate('medium');

		try {
			show({ text: t('transfer.qr-code') }, (value) => {
				if (!value) return;
				const addressValidation = validateAddress(cryptoCurrencies, value, cryptoCurrency);

				if (!addressValidation) {
					close();
					notify({ type: 'error', message: t('exchanges.scanner.address.error'), position: 'top-right' });
					return;
				}

				setValue('address', value);
				close();
			});
		} catch (error) {
			console.error(error);
			notify({ type: 'error', message: t('scanner.error') });
		}
	};
	return (
		<Container>
			<BackButton onClick={() => navigate('/exchanges/select')} />
			<Wallet>
				<div className="image">
					<HiCreditCard size={24} fill="#fff" />
				</div>
				<div className="info">
					<p className="name">{method.name}</p>
					<p className="balance">{cryptoCurrency.split('_')[1]}</p>
				</div>
			</Wallet>

			<form id="exchange-form" onSubmit={handleSubmit(send)}>
				<Controller
					name="address"
					control={control}
					rules={{
						validate: (value) => {
							const addressValidation = validateAddress(cryptoCurrencies, value, cryptoCurrency);
							console.log(addressValidation, 'addressValidation');
							if (!addressValidation) {
								return t('exchanges.address.invalid');
							}
						},
					}}
					render={({ field }) => (
						<AddressInput
							label={t('exchanges.address')}
							placeholder={t('exchanges.address.placeholder')}
							required
							onScanQR={handleOpenScanner}
							error={errors?.address}
							{...field}
						/>
					)}
				/>
				<Controller
					name="amount_from"
					control={control}
					rules={{
						validate: (value) => {
							if (!value) return t('exchanges.amount.required');
							const numberValue = parseFloat(value);
							if (numberValue < parseFloat(limit?.min || '0')) {
								return t('exchanges.fiat_currency.limit.min', { min: limit?.min });
							}
							if (numberValue > parseFloat(limit?.max || 'Infinity')) {
								return t('exchanges.fiat_currency.limit.max', { max: limit?.max });
							}
						},
					}}
					render={({ field }) => (
						<ExchangeInput
							currency={fiatCurrency}
							list={fiatCurrencies}
							label={t('exchanges.fiat_currency')}
							placeholder={t('exchanges.fiat_currency.placeholder')}
							required
							onSelect={(curr) => setFiatCurrency(curr.symbol)}
							{...field}
							onBlur={() => loadEstimate()}
						/>
					)}
				/>


				<Controller
					name="amount_to"
					control={control}
					render={({ field }) => (
						<ExchangeInput
							currency={cryptoCurrency}
							list={cryptoCurrencies}
							disabled={['simpleswap'].includes(params.methodName)}
							label={t('exchanges.crypto_currency')}
							placeholder={t('exchanges.crypto_currency.placeholder')}
							required
							{...field}
							onSelect={handleSelectCoin}
						/>
					)}
				/>

				{!isValid && limit && (
					<div className="default_feedback">
						{t('exchanges.limit', { min: limit.min, max: limit.max })}
					</div>
				)}
			</form>

			<Footer className="mx-4">
				<button
					type="submit"
					form="exchange-form"
					className="flex text-center justify-center items-center appearance-none py-1 transition-colors focus:outline-none cursor-pointer select-none overflow-hidden z-10 w-full flex relative uppercase duration-100 font-semibold px-2 rounded text-black bg-primary active:bg-ios-primary-shade h-11"
					role="button"
					disabled={isSubmitting || !isValid}
				>
					{t('exchanges.create.deposit')}
				</button>
			</Footer>
		</Container>
	);
}