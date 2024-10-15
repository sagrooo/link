import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { useStore } from "@/shared/hooks/index.ts";
import { ConfigureTwoFactorWidget } from "@/widgets/auth/configure-two-factor/index.ts";

export const ConfigureTwoFactor = observer(() => {
  const { authStore } = useStore();
  if (authStore.username === null) {
    return <Redirect to={"/auth/sign-in"} />;
  }
  return <ConfigureTwoFactorWidget />;
});
