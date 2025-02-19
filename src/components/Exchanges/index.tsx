import { forwardRef } from 'react';
import { Card } from 'konsta/react';
import { SelectCoin } from './SelectCoin';

export const ExchangeInput = forwardRef(({ label, onSelect, list, currency, ...props }, ref) => {
	return (
		<Card>
			<label className="block text-sm/6 font-medium">{label}</label>
			<div className="mt-2">
				<div className="flex items-center rounded-md pl-3 outline outline-1 -outline-offset-1 outline-gray-300 bg-transparent">
					<input {...props} ref={ref} className="block text-base appearance-none w-full focus:outline-none bg-transparent h-10 placeholder-black placeholder-opacity-30 dark:placeholder-white dark:placeholder-opacity-30" />
					<SelectCoin onSelect={onSelect} list={list} currency={currency} />
				</div>
			</div>
		</Card>
	);
});