import { Block, List, ListInput, Page } from 'konsta/react';
import { BackButton, useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import { useWizardContext } from '../Wizard';
import { useMint } from './provider/mint';

const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 30px;
`;

const Container = styled(Page)`
  display: flex;
  flex-direction: column;

	.invalid-feedback {
		color: red;
	}
`;

export const NftName = () => {
	const { handleNext, state, handlePrev } = useWizardContext();
	const {
		handleSubmit,
		setValue,
		getValues,
		formState: { errors }
	} = useForm();
	const [vibrate] = useHapticFeedback();
	const { t } = useTranslation();
	const { send } = useMint();
	const onSubmit = (values: any) => {
		// setState({ image: state.image, text: state.text, name: values.name });
		handleNext(() =>
			send({
				image: state.image,
				info: state.text,
				name: values.name,
				address: values.address,
				order_id: values.order_id
			}));
	};
	return (
		<Container>
			<BackButton
				onClick={() => {
					handlePrev();
					vibrate('heavy');
				}}
			/>
			<div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center -mb-6 font-semibold text-[1.5rem] text-center">
				{t('qrmint.nftName.title')}
			</div>
			<Block>
				<p className="text-center">
					{t('qrmint.nftName.subtitle')}
				</p>
			</Block>
			<form id="name-form" onSubmit={handleSubmit(onSubmit)}>
				<List className="mb-0" strongIos insetIos>
					<ListInput
						className="w-full"
						label={t('qrmint.nftName.form.text.label')}
						type="text"
						placeholder="text"
						onChange={(e) => setValue('name', e.target.value, { shouldValidate: true })}
						onBlur={(e) => setValue('name', e.target.value, { shouldValidate: true })}
						value={getValues('name')}
						required
						name="name"
					/>
				</List>
				{errors.text && <div className="invalid-feedback pl-4">{t('qrmint.nftName.form.text.error')}</div>}
			</form>
			<Footer className="mx-4">
				<button
					type="submit"
					form="name-form"
					className="flex text-center justify-center items-center appearance-none py-1 transition-colors focus:outline-none cursor-pointer select-none overflow-hidden z-10 w-full flex relative uppercase duration-100 font-semibold px-2 rounded text-black bg-primary active:bg-ios-primary-shade h-11"
					role="button"
					tabIndex={0}
				>
					{t('qrmint.next')}
				</button>
			</Footer>
		</Container>
	);
};

