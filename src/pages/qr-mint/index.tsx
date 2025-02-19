import { WizardContainer } from "@/components/Wizard";
import { WizardStages } from "@/components/Wizard/WizardStage";

import { Generate } from "../../components/Mint/Generate";
import { InformQrCode } from "../../components/Mint/InfoQRCode";
import { View } from "../../components/Mint/View";
//import { NftName } from '../../components/Mint/NftName';
import { MintState } from "../../components/Mint/MintState";
import { MintProvider } from "@/components/Mint/provider/mint";
import { withAuth } from "../../components/withAuth";

const QRMintPage = () => {
  return (
    <MintProvider>
      <WizardContainer>
        <WizardStages>
          <Generate />
          <InformQrCode />
          <View />
          <MintState />
        </WizardStages>
      </WizardContainer>
    </MintProvider>
  );
};

export const QRMint = withAuth(QRMintPage);
