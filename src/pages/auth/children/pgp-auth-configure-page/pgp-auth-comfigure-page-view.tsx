import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { useStore } from "@/shared/hooks";
import { PgpPassphraseWidget } from "@/widgets/auth/pgp-passphrase";

export const PgpAuthConfigurePage = observer(() => {
  const { authStore } = useStore();
  if (authStore.token === null) {
    return <Redirect to="/auth/sign-in" />;
  }
  return <PgpPassphraseWidget />;
});
