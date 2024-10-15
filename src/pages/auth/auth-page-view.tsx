import { observer } from "mobx-react";
import { Redirect } from "react-router";
import { Route, Switch } from "react-router-dom";

import { ConfigureTwoFactorPage } from "@/pages/auth/children/configure-two-factor";
import { GoogleAuthConfigurePage } from "@/pages/auth/children/google-auth-configure-page";
import { PgpAuthConfigurePage } from "@/pages/auth/children/pgp-auth-configure-page";
import { SignInPage } from "@/pages/auth/children/sign-in";
import { SignUpPage } from "@/pages/auth/children/sign-up";
import { TwoFactorAuthPage } from "@/pages/auth/children/two-factor-auth";
import { ROUTES } from "@/shared/_constants.ts";
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
              path={ROUTES.auth}
              render={() => <Redirect to={ROUTES.signIn} />}
            />
            <Route path={ROUTES.signIn} component={SignInPage} />
            <Route path={ROUTES.signUp} component={SignUpPage} />

            <Route
              path={ROUTES.configureTwoFactor}
              component={ConfigureTwoFactorPage}
            />

            <Route
              path={ROUTES.googleAuthConfigure}
              component={GoogleAuthConfigurePage}
            />
            <Route
              path={ROUTES.pgpAuthConfigure}
              component={PgpAuthConfigurePage}
            />

            <Route
              path={ROUTES.pgpAuthConfigure}
              component={TwoFactorAuthPage}
            />
          </Switch>
        </Content>
      </Container>
    </>
  );
});
