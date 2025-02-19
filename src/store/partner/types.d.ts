type PartnerState = {
  partnerLink: string | null;
  code: string | null;
};

type PartnerActions = {
  loadLink: () => Promise<void>;
};

export type PartnerStore = PartnerState & PartnerActions;
