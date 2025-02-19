type SettingsState = {
  language: string | null;
  fiatCurrency: string;
  cryptoCurrency: string;
};

type SettingsActions = {
  setLanguage: (language: string) => void;
  setFiatCurrency: (value: string) => void;
  setCryptoCurrency: (value: string) => void;
};

export type SettingsStore = SettingsState & SettingsActions;
