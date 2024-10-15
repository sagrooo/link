import { useState } from "react";

import { Button } from "@/shared/ui/button.tsx";
import { Text } from "@/shared/ui/text.tsx";
import { QrScanWidget } from "@/widgets/auth/qr-scan/index.tsx";
import { SavePgpAuthWidget } from "@/widgets/auth/save-pgp-auth/index.tsx";

import { TabsView } from "./_components/tabs";
import { ConfigureStep, Tab } from "./_types.ts";
import { Container } from "./configure-two-factor-widget.styles.ts";

export const ConfigureTwoFactorWidget = () => {
  const [step, setStep] = useState<ConfigureStep>("1");
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Google);

  const handleSubmit = () => {
    setStep(ConfigureStep.SaveSecret);
  };

  if (step === ConfigureStep.SaveSecret) {
    switch (selectedTab) {
      case Tab.Google:
        return <QrScanWidget />;
      default:
        return <SavePgpAuthWidget />;
    }
  }

  return (
    <Container>
      <Text>Для продолжения необходимо установить 2FA</Text>
      <TabsView onChange={setSelectedTab} />
      <Button onClick={handleSubmit}>Установить</Button>
    </Container>
  );
};
