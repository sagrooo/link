import { createBrowserHistory } from "history";
import { useEffect } from "react";
import { Router } from "react-router-dom";

import { RouterStore, syncHistoryWithStore } from "@ibm/mobx-react-router";

import { StoreContext } from "@/shared/hooks/use-store";
import { RootStore } from "@/shared/store/root-store";
import { GlobalStyle } from "@/shared/styles/global";
import { ThemeProvider } from "@/shared/theme";

import { AppRoutes } from "./routes";

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const history = syncHistoryWithStore(browserHistory, routingStore);

const store = new RootStore(routingStore);

export const App = () => {
  useEffect(() => {
    if (store.authStore.isAuth) {
      void store.authStore.fetchUser();
    }
  }, []);

  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider>
        <GlobalStyle />
        <Router history={history} location={history.location}>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </StoreContext.Provider>
  );
};
