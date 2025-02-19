import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BackButton,
  useHapticFeedback,
} from "@vkruglikov/react-telegram-web-app";
import { Page, Preloader, Block, Card } from "konsta/react";

import { generate } from "../../api/generate";
import { Canvas } from "../Canvas";
import { useWizardContext } from "../Wizard";
import { useTranslation } from "react-i18next";
import { CustomButton } from "../Button";

import { getAttributes } from "../../api/nft";
import { Payment } from "./Payment";
import { useMint } from "./provider/mint";
import { useNotification } from "@/providers/notification";
import { useWalletStore } from "@/store/wallet";

const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 30px;
`;

const Container = styled(Page)`
  display: flex;
  flex-direction: column;

  .invalid-feedback {
    color: red;
  }
`;

const ContainerCanvas = styled.div`
  position: relative;
  display: inline-block;

  .canvas-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0); /* Прозрачный фон */
    z-index: 10;
  }
`;

const Placeholder = styled.div`
  width: 320px;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const View = () => {
  const { address } = useWalletStore();
  const { notify } = useNotification();
  const [sheetOpened, setSheetOpened] = useState(false);
  const { t } = useTranslation();
  const [attributes, setAttributes] = useState();
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [vibrate] = useHapticFeedback();
  const { state, handlePrev, handleNext, setState } = useWizardContext();
  const { send } = useMint();

  useEffect(() => {
    if (attributes) return;
    getAttributes(state.text).then((res) => {
      setAttributes(res);
    });

    // Отключение правой кнопки мыши
    const handleContextMenu = (event) => event.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Предотвращение перетаскивания изображений
    const handleDragStart = (event) => event.preventDefault();
    document.addEventListener("dragstart", handleDragStart);

    // Очистка слушателей при размонтировании компонента
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        setLoading(true);
        const data = await generate(state);
        setQrImage(data);
        setState({ image: data, text: state.text });
        //setState({ image: data, text: state.text });
      } catch (err) {
        notify({ type: "error", message: err.message });
      } finally {
        setLoading(false);
      }
    };

    if (!loading && !qrImage) {
      fetchQRCode();
    }
  }, [state]);

  const draw = (ctx) => {
    if (!(qrImage instanceof Blob || qrImage instanceof File)) {
      console.error("Invalid qrImage object");
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(qrImage);
    img.src = url;

    img.onload = () => {
      // Отрисовка QR-кода
      ctx.drawImage(img, 0, 0, 320, 320);

      // Добавление водяного знака
      ctx.font = "20px Arial";
      ctx.fillStyle = "rgba(255, 255, 255)"; // Полупрозрачный белый цвет
      ctx.textAlign = "center";
      ctx.fillText("created by QR Mint", 170, 300);

      // Очистка URL объекта
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      console.error("Failed to load image");
      URL.revokeObjectURL(url);
    };
  };

  const renderImage = (qrImage) => {
    if (qrImage)
      return (
        <ContainerCanvas>
          <Canvas width={320} height={320} draw={draw} />
          <div className="canvas-overlay" />
        </ContainerCanvas>
      );
    return (
      <Placeholder className="dark:bg-ios-dark-surface-1">
        <Preloader />
      </Placeholder>
    );
  };

  return (
    <Container>
      <BackButton
        onClick={() => {
          handlePrev();
          vibrate("heavy");
        }}
      />
      <div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center -mb-6 font-semibold text-[1.5rem] text-center">
        {t("qrmint.view.title")}
      </div>
      <p>Hello</p>
      <Block>
        <p className="text-center">{t("qrmint.view.subtitle")}</p>
      </Block>
      <div className="flex justify-center">{renderImage(qrImage)}</div>
      {attributes && (
        <Card>
          <b>{t("qrmint.view.attributes")}:</b>{" "}
          {attributes.map((attr) => attr.value).join(", ")}
        </Card>
      )}
      <Footer className="mx-4">
        <CustomButton
          onClick={() => setSheetOpened(true)}
          large
          disabled={!qrImage}
        >
          Mint
        </CustomButton>
      </Footer>
      <Payment
        t={t}
        address={address}
        sheetOpened={sheetOpened}
        onClose={() => setSheetOpened(false)}
        onAfterPaid={(order_id: number) =>
          handleNext(
            send({
              image: state.image,
              attributes,
              info: state.text,
              address,
              order_id,
            }),
          )
        }
      />
    </Container>
  );
};
