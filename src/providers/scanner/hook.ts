import { useContext } from 'react';
import { ScannerContext } from './provider';

export const useScanner = () => useContext(ScannerContext);
