import { observer } from "mobx-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { useHistory } from "react-router";

import { useStore } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Text } from "@/shared/ui/text";
import { Container } from "@/widgets/auth/configure-two-factor/configure-two-factor-widget.styles";
import { SecretKey } from "@/widgets/auth/google-auth/_components/secret-key";

export const QrScanWidget = observer(() => {
  const { authStore } = useStore();
  const history = useHistory();

  useEffect(() => {
    void authStore.generateTOTPSecret();
  }, []);

  const handleGoToVerify = () => {
    history.push("/auth/two-factor/google");
  };

  return (
    <Container>
      <Text>Для продолжения необходимо сохранить сгенерированный ключ</Text>
      {authStore.otp?.otpauthUrl ? (
        <QRCodeSVG width={122} height={122} value={authStore.otp?.otpauthUrl} />
      ) : (
        <Skeleton width={"122px"} height={"122px"} />
      )}
      <SecretKey secret={authStore.otp?.secret} />
      <Button onClick={handleGoToVerify}>Далее</Button>
    </Container>
  );
});
