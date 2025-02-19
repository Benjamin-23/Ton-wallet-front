import { forwardRef } from 'react';
import { Card } from 'konsta/react';
import { HiQrCode } from 'react-icons/hi2';

export const AddressInput = forwardRef(({ error, label, onScanQR, ...props }, ref) => {
	return (
		<Card>
			<label className="block text-sm/6 font-medium">{label}</label>
			<div className="mt-2">
				<div className="flex items-center rounded-md pl-3 outline outline-1 -outline-offset-1 outline-gray-300 bg-transparent">
					<input {...props} className="block text-base appearance-none w-full focus:outline-none bg-transparent h-10 placeholder-black placeholder-opacity-30 dark:placeholder-white dark:placeholder-opacity-30" ref={ref} />
					<div onClick={onScanQR} className="p-4 cursor-pointer">
						<HiQrCode size={24} />
					</div>
				</div>
			</div>
			<div style={{ height: 20 }} className="text-red-600 mt-2">{error?.message}</div>
		</Card>
	);
});

