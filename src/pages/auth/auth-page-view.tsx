import { observer } from "mobx-react";
import { Redirect } from "react-router";
import { Route, Switch } from "react-router-dom";

import { ConfigureTwoFactor } from "@/pages/auth/children/configure-two-factor/index.tsx";
import { GoogleAuthPage } from "@/pages/auth/children/google-auth";
import { PgpPassphrase } from "@/pages/auth/children/pgp-passphrase/index.tsx";
import { SignInPage } from "@/pages/auth/children/sign-in";
import { SignUpPage } from "@/pages/auth/children/sign-up";
import { useStore } from "@/shared/hooks";

import { AuthLogo, Container, Content, ShieldLogo } from "./auth-page.styles";

export const AuthPage = observer(() => {
  const { authStore } = useStore();
  if (authStore.isAuth) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Container>
        <AuthLogo />
        <Content>
          <ShieldLogo />
          <Switch>
            <Route
              exact
              path="/auth"
              render={() => <Redirect to="/auth/sign-in" />}
            />
            <Route path="/auth/sign-in" component={SignInPage} />
            <Route path="/auth/sign-up" component={SignUpPage} />
            <Route
              path="/auth/two-factor/configure"
              component={ConfigureTwoFactor}
            />
            <Route path="/auth/two-factor/google" component={GoogleAuthPage} />
            <Route
              path="/auth/two-factor/pgp-passphrase"
              component={PgpPassphrase}
            />
          </Switch>
        </Content>
      </Container>
    </>
  );
});
