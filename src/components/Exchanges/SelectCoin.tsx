import { useState, useRef, useMemo, useCallback, memo } from 'react';
import { List, ListItem, Panel, Page, ListInput, Preloader } from 'konsta/react';
import { HiChevronDown } from 'react-icons/hi2';
import { GoSearch } from 'react-icons/go';

export const SelectCoin = memo(({ onSelect, list, currency }) => {
	const [ search, setSearch ] = useState('');
	const [ popoverOpened, setPopoverOpened ] = useState(false);
	const popoverTargetRef = useRef(null);

	const openPopover = useCallback((targetRef) => {
		popoverTargetRef.current = targetRef;
		setPopoverOpened(true);
	}, []);

	const foundCurrency = useMemo(() => {
		if (currency.includes('_')) {
			const [ chain, symbol ] = currency.split('_');
			return list?.find((curr) => curr.network === chain && curr.symbol === symbol);
		}
		return list?.find((curr) => curr.symbol === currency);
	}, [ currency, list ]);

	const listItems = useMemo(() => {
		return list
			.filter((currency) => currency.name.toLowerCase().includes(search.toLowerCase()) || currency.symbol.toLowerCase().includes(search.toLowerCase()))
			.map((currency) => (
				<ListItem
					key={`${currency.network}_${currency.symbol}`}
					media={<img width={24} height={24} src={currency.image} alt={currency.symbol} />}
					title={currency.name}
					after={currency.network.toUpperCase()}
					link
					onClick={() => handleSelect(currency)}
				/>
			));
	}, [ search, list ]);

	const handleSelect = (currency) => {
		setPopoverOpened(false);
		onSelect(currency);
	};

	const { image, symbol } = foundCurrency || {};

	if (list.length === 0) {
		return (
			<div className="p-4 cursor-pointer">
				<div className="flex justify-start items-center">
					<Preloader />
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="p-4 cursor-pointer" onClick={() => openPopover('.list-coins')}>
				<div className="flex justify-start items-center">
					<div className="mr-1 cursor-pointer">
						<img
							style={{ maxWidth: '24px' }}
							width={24}
							height={24}
							src={image} // fallback image
							alt={symbol} // alt text
						/>
					</div>
					<p>{symbol?.toUpperCase()}</p>
					<div style={{ marginLeft: 'auto' }}>
						<HiChevronDown size={16} />
					</div>
				</div>
			</div>
			<Panel
				opened={popoverOpened}
				side="left"
				onBackdropClick={() => setPopoverOpened(false)}
			>
				<Page>
					<List nested>
						<ListInput
							label="Search currency"
							type="text"
							placeholder="Search"
							media={<GoSearch />}
							onChange={(e) => setSearch(e.target.value)}
						/>
						{listItems}
					</List>
				</Page>
			</Panel>
		</>
	);
});
