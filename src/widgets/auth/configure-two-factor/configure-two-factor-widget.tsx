import { useState } from "react";
import { useHistory } from "react-router";

import { ROUTES } from "@/shared/_constants.ts";
import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";

import { TabsView } from "./_components/tabs";
import { Tab } from "./_types.ts";
import { Container } from "./configure-two-factor-widget.styles";

export const ConfigureTwoFactorWidget = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Google);
  const history = useHistory();

  const handleSubmit = () => {
    history.push(
      selectedTab === Tab.Google
        ? ROUTES.googleAuthConfigure
        : ROUTES.pgpAuthConfigure,
    );
  };

  return (
    <Container>
      <Text>Для продолжения необходимо установить 2FA</Text>
      <TabsView onChange={setSelectedTab} />
      <Button onClick={handleSubmit}>Установить</Button>
    </Container>
  );
};
