import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { useStore } from "@/shared/hooks";

export const TwoFactorAuth = observer(() => {
  const { authStore } = useStore();
  if (!Boolean(authStore.user)) {
    return <Redirect to="/auth/sign-in" />;
  }

  return null;
});
