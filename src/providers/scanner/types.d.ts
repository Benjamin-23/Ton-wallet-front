
export interface IScanner {
  value: string;
  setValue: (value: string) => void;
}

export interface ScannerProviderProps {
  children: ReactNode;
}
