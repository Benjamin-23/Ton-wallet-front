import { Route, Routes } from "react-router-dom";
import { type FunctionComponent, useEffect, useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";

import { Home } from "@/pages";
import { Scanner } from "@/pages/scanner";
import { QRMint } from "@/pages/qr-mint";
import { SettingsRouter } from "@/pages/settings/router";
import { Connect } from "@/pages/connect";
import { useAuthStore } from "@/store/auth";
import { Onboarding } from "@/components/Onboarding";
import { Partners } from "@/pages/partners";
import { useWalletStore } from "@/store/wallet";
import { ExchangesRouter } from "@/pages/exchanges";
import { Link } from "@/pages/link";
import NFTLending from "@/pages/Nft";

export const AppRouter: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connector] = useTonConnectUI();
  const { auth, getMe, access_token } = useAuthStore();
  const { setTonConnector } = useWalletStore();

  useEffect(() => {
    if (connector) setTonConnector(connector);
  }, [connector, setTonConnector]);

  useEffect(() => {
    const fetchUser = async () => {
      if (access_token) {
        await getMe();
      } else {
        await auth();
      }
    };
    fetchUser();
  }, [access_token, auth, getMe]);

  if (isLoading) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scanner" element={<Scanner />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/qr-mint" element={<QRMint />} />
      <Route path="/settings/*" element={<SettingsRouter />} />
      <Route path="/exchanges/*" element={<ExchangesRouter />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/link/:key" element={<Link />} />
      <Route path="/Nft" element={<NFTLending />} />
    </Routes>
  );
};
