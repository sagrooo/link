import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";

import { GenerateOtpResponse } from "@/shared/store/google-auth-store/_types.ts";
import { Button, ButtonVariant } from "@/shared/ui/button";
import { CommonContainer } from "@/shared/ui/common-container.ts";
import { CopyTextButton } from "@/shared/ui/copy-text-button.tsx";
import { Skeleton } from "@/shared/ui/skeleton";
import { Text } from "@/shared/ui/text";

import { QrScanSkeleton } from "./qr-scan-skeleton.tsx";
import { ButtonContainer } from "./qr-scan-view.styles.ts";

type Props = {
  onGenerate: () => void;
  otp: GenerateOtpResponse | null;
  onNextStep: () => void;
  isLoading?: boolean;
};

export const QrScan = ({ isLoading, onGenerate, otp, onNextStep }: Props) => {
  useEffect(() => {
    onGenerate();
  }, []);

  if (isLoading) {
    return <QrScanSkeleton />;
  }

  return (
    <CommonContainer>
      <Text $align={"center"}>
        Для продолжения необходимо сохранить сгенерированный ключ
      </Text>
      {otp?.otpauthUrl ? (
        <QRCodeSVG width={122} height={122} value={otp?.otpauthUrl} />
      ) : (
        <Skeleton width={"122px"} height={"122px"} />
      )}
      <CopyTextButton secret={otp?.secret} />
      <ButtonContainer>
        <Button onClick={onNextStep}>Далее</Button>
        <Button variant={ButtonVariant.Secondary} onClick={onGenerate}>
          Сгенерирвоать новый
        </Button>
      </ButtonContainer>
    </CommonContainer>
  );
};
