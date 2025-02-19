import { useContext } from 'react';
import { NotificationContext } from './provider';

export const useNotification = () => useContext(NotificationContext);
