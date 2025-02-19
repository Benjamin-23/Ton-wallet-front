import { Card, Page } from "konsta/react";
import { type FunctionComponent } from "react";

import { Tabbar } from "@/components/Tabbar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { HiQrcode, HiChevronRight, HiCreditCard } from "react-icons/hi";
import { HiQrCode } from "react-icons/hi2";
import styled from "styled-components";

const ContanerButton = styled.div`
  display: flex;
  flex-flow: column;
  row-gap: 1rem;
  padding: 2rem 1rem;
`;

const ButtonCard = styled(Card)`
  .icon {
    display: grid;
    place-items: center;

    svg {
      width: 1.5rem;
      height: 1.5rem;
      color: #1470f5;
      flex-shrink: 0;
    }
  }

  .title {
    font-size: 1rem;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: -0.43px;
    text-align: left;
  }

  .subtitle {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: -0.15px;
    text-align: left;
  }

  .right-icon {
    display: grid;
    place-items: center;

    svg {
      width: 0.375rem;
      height: 0.625rem;
      flex-shrink: 0;
      color: #8e8e93;
    }
  }
`;

export const Home: FunctionComponent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Page>
      <div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center mb-4 font-semibold text-[1.5rem]">
        {t("home.title")}
      </div>
      <ContanerButton>
        <ButtonCard
          className="cursor-pointer"
          onClick={() => navigate("/qr-mint")}
          margin="0"
        >
          <div className="flex justify-start items-center">
            <div className="mr-1 cursor-pointer icon">
              <HiQrCode fill="#fff" size={36} />
            </div>
            <div>
              <p className="title">{t("home.menu.GenerateQRArt.title")}</p>
              <p className="subtitle">
                {t("home.menu.GenerateQRArt.subtitle")}
              </p>
              {/* <p>kuna kitu kweli </p> */}
            </div>
            <div style={{ marginLeft: "auto" }}>
              <HiChevronRight size={16} />
            </div>
          </div>
        </ButtonCard>
        <ButtonCard
          className="cursor-pointer"
          onClick={() => navigate("/scanner")}
          margin="0"
        >
          <div className="flex justify-start items-center">
            <div className="mr-1 cursor-pointer icon">
              <HiQrcode fill="#fff" size={36} />
            </div>
            <div>
              <p className="title">{t("home.menu.Scanner.title")}</p>
              <p className="subtitle">{t("home.menu.Scanner.subtitle")}</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <HiChevronRight size={16} />
            </div>
          </div>
        </ButtonCard>
        <ButtonCard
          className="cursor-pointer"
          onClick={() => navigate("/exchanges/select")}
          margin="0"
        >
          <div className="flex justify-start items-center">
            <div className="mr-1 cursor-pointer icon">
              <HiCreditCard fill="#fff" size={36} />
            </div>
            <div>
              <p className="title">{t("home.menu.Deposit.title")}</p>
              <p className="subtitle">{t("home.menu.Deposit.subtitle")}</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <HiChevronRight size={16} />
            </div>
          </div>
        </ButtonCard>
      </ContanerButton>
      <Tabbar />
    </Page>
  );
};
