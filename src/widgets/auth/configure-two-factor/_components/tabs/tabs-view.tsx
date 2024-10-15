import { useState } from "react";

import { Tab } from "@/widgets/auth/configure-two-factor/_types";

import { TabButton, TabsContainer } from "./tabs.styles";

type Props = {
  onChange: (tab: Tab) => void;
  initialTab?: Tab;
};

export const TabsView = ({ onChange, initialTab }: Props) => {
  const [selectedTab, setSelectedTab] = useState(initialTab || Tab.Google);

  const handleTabChange = (tab: Tab) => {
    setSelectedTab(tab);
    onChange(tab);
  };

  return (
    <TabsContainer>
      <TabButton
        $active={selectedTab === Tab.Google}
        onClick={() => handleTabChange(Tab.Google)}
      >
        Google Authentication
      </TabButton>
      <TabButton
        $active={selectedTab === Tab.Pgp}
        onClick={() => handleTabChange(Tab.Pgp)}
      >
        PGP
      </TabButton>
    </TabsContainer>
  );
};
