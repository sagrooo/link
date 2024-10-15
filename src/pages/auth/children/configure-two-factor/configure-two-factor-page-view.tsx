import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { useStore } from "@/shared/hooks";
import { ConfigureTwoFactorWidget } from "@/widgets/auth/configure-two-factor";

export const ConfigureTwoFactorPage = observer(() => {
  const { authStore } = useStore();

  if (authStore.token === null) {
    return <Redirect to={"/auth/sign-in"} />;
  }

  return <ConfigureTwoFactorWidget />;
});
