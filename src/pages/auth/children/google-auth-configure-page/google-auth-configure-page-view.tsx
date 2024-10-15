import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { ROUTES } from "@/shared/_constants.ts";
import { useStore } from "@/shared/hooks";
import { ConfigureGoogleAuthWidget } from "@/widgets/auth/configure-google-auth";

export const GoogleAuthConfigurePage = observer(() => {
  const { authStore } = useStore();

  if (authStore.user === null) {
    return <Redirect to={ROUTES.signIn} />;
  }

  return <ConfigureGoogleAuthWidget />;
});
