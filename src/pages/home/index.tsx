import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { useStore } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";

export const HomePage = observer(() => {
  const { authStore } = useStore();

  if (!authStore.isAuth) {
    return <Redirect to={"/auth/sign-in"} />;
  }
  return (
    <div>
      Hello
      <Button onClick={authStore.logout}>Logout</Button>
    </div>
  );
});
