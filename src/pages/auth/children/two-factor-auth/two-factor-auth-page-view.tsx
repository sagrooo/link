import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { useStore } from "@/shared/hooks";

export const TwoFactorAuthPage = observer(() => {
  const { authStore } = useStore();
  if (!authStore.user) {
    return <Redirect to="/auth/sign-in" />;
  }

  return null;
});
