import { useEffect, useState } from 'react';
import { Navbar, Page, Popup, Link, List, ListInput, ListItem } from 'konsta/react';
import { HiLink } from 'react-icons/hi';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';

import { getLinks, createDynamicLink } from '@/api/link';
import { useNotification } from '@/providers/notification';

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

export const DynamicLinks = ({ t, popupOpened, onClose, onSetInfo }) => {
	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm();
	const { notify } = useNotification();
	const [ links, setLinks ] = useState();

	useEffect(() => {
		const loadLinks = async () => {
			try {
				const links = await getLinks();
				setLinks(links);
			} catch (err) {
				notify({
					type: 'error',
					message: (err as Error).message
				});
			}
		};
		if (!links) {
			loadLinks();
		}
	}, [links]);

	const onSubmit = async ({ url }) => {
		try {
			const foundLink = links?.some((link) => link.url === url);
			if (!foundLink) {
				const key = await createDynamicLink({ url });
				onSetInfo(`https://app.qr-mint.net/link/${key}`);
			} else {
				onSetInfo(`https://app.qr-mint.net/link/${foundLink.key}`);
			}
			
			onClose();
			setLinks(undefined);
		} catch (err) {
			notify({
				type: 'error',
				message: (err as Error).message
			});
		}
	};

	const handleSelect = (link) => {
		console.log(link);
		onSetInfo(`https://app.qr-mint.net/link/${link.key}`);
		onClose();
		setLinks(undefined);
	};

	return (
		<Popup
			opened={popupOpened}
			onBackdropClick={onClose}>
			<Container>
				<Navbar
					title={t('dynamicLink.title')}
					right={
						<Link navbar onClick={onClose}>
							{t('qrmint.close')}
						</Link>
					}
				/>
				<p className="text-center mt-4">
					{t('dynamicLink.subtitle')}
				</p>
				<form id="link-form" onSubmit={handleSubmit(onSubmit)}>
					<List className="mb-0" strongIos insetIos>
						<Controller
							name="url"
							control={control}
							rules={{
								required: true,
                
							}}
							render={({ field }) => (
								<ListInput
									{...field}
									className="w-full"
									label={t('dynamicLink.label')}
									type="url"
									placeholder={t('dynamicLink.placeholder')}
									required
									media={<HiLink fill="#fff" />}
								/>
							)}
						/>
					</List>
					{errors.text && <div className="invalid-feedback pl-4">{t('dynamicLink.error')}</div>}
					<List>
						{links?.map((link) =>
							<ListItem
								className="cursor-pointer"
								onClick={() => handleSelect(link)}
								key={link.id}
								media={<HiLink fill="#fff" />}
								title={link.url}
							/>
						)}		
					</List>
				</form>
				<Footer className="mx-4">
					<button
						type="submit"
						form="link-form"
						className="flex text-center justify-center items-center appearance-none py-1 transition-colors focus:outline-none cursor-pointer select-none overflow-hidden z-10 w-full flex relative uppercase duration-100 font-semibold px-2 rounded text-black bg-primary active:bg-ios-primary-shade h-11"
						role="button"
						tabIndex={0}
					>
						{t('dynamicLink.add')}
					</button>
				</Footer>
			</Container>
		</Popup>
	);
};
