import { observer } from "mobx-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { useHistory } from "react-router";

import { useStore } from "@/shared/hooks/index.ts";
import { Button } from "@/shared/ui/button.tsx";
import { Skeleton } from "@/shared/ui/skeleton.ts";
import { Text } from "@/shared/ui/text.tsx";
import { Container } from "@/widgets/auth/configure-two-factor/configure-two-factor-widget.styles.ts";
import { SecretKey } from "@/widgets/auth/google-auth/_components/secret-key.tsx";

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
