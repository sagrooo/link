import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { ROUTES } from "@/shared/_constants.ts";
import { useStore } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";

export const HomePage = observer(() => {
  const { authStore } = useStore();

  console.log(authStore.isAuth);
  if (!authStore.isAuth) {
    return <Redirect to={ROUTES.signIn} />;
  }

  return (
    <div>
      Hello
      <Button onClick={authStore.logout}>Logout</Button>
    </div>
  );
});
