import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { useStore } from "@/shared/hooks/index.ts";
import { PgpPassphraseWidget } from "@/widgets/auth/pgp-passphrase";

export const PgpPassphrase = observer(() => {
  const { authStore } = useStore();
  if (authStore.username === null) {
    return <Redirect to="/auth/sign-in" />;
  }
  return <PgpPassphraseWidget />;
});
