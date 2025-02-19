import { Notification } from 'konsta/react';
import { HiCheckCircle, HiExclamationTriangle, HiOutlineXCircle } from 'react-icons/hi2';

import { createContext, useState } from 'react';
import type { FunctionComponent } from 'react';
import type { INotification, NotificationProviderProps, Notify, NotifyType } from './types';

export const NotificationContext = createContext<INotification>({} as INotification);

export const NotificationProvider: FunctionComponent<NotificationProviderProps> = ({
	children,
}) => {
	const [ message, setMessage ] = useState<string>('');
	const [ isOpened, setIsOpened ] = useState<boolean>(false);
	const [ messageType, setMessageType ] = useState<NotifyType>('default');

	const notify = ({ message, type }: Notify) => {
		setMessage(message);
		setMessageType(type);
		setIsOpened(true);

		setTimeout(() => {
			setIsOpened(false);
		}, 1500);
	};

	const getMessageIcon = (type: NotifyType) => {
		if (type === 'success') {
			return <HiCheckCircle className="w-[1.25rem] h-[1.25rem]" color="#16db65" />;
		} else if (type === 'error') {
			return <HiOutlineXCircle className="w-[1.25rem] h-[1.25rem]" color="#ef233c" />;
		} else if (type === 'warning') {
			return <HiExclamationTriangle className="w-[1.25rem] h-[1.25rem]" color="#ffea00" />;
		}
		return;
	};

	return (
		<NotificationContext.Provider value={{ notify }}>
			{children}

			<Notification
				title="QR Mint"
				icon={getMessageIcon(messageType)}
				opened={isOpened}
				subtitle={message}
			/>
		</NotificationContext.Provider>
	);
};
