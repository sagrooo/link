import { Route, Switch } from "react-router-dom";

import { AuthPage } from "@/pages/auth";
import { HomePage } from "@/pages/home";

export const AppRoutes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/auth" component={AuthPage} />
    <Route path="*" component={() => <div>Not Found</div>} />
  </Switch>
);
