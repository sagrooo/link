import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";
import { QrScanWidget } from "@/widgets/auth/qr-scan";
import { SavePgpAuthWidget } from "@/widgets/auth/save-pgp-auth";

import { TabsView } from "./_components/tabs";
import { Tab } from "./_types.ts";
import { Container } from "./configure-two-factor-widget.styles";

export const ConfigureTwoFactorWidget = () => {
  const [step, setStep] = useState<ConfigureStep>(ConfigureStep.SelectType);
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
