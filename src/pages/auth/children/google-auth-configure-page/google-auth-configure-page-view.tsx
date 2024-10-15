import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { useStore } from "@/shared/hooks";
import { GoogleAuth } from "@/widgets/auth/google-auth";

export const GoogleAuthConfigurePage = observer(() => {
  const { authStore } = useStore();
  if (authStore.token === null) {
    return <Redirect to={"/auth/sign-in"} />;
  }
  return <GoogleAuth />;
});
