import { createBrowserHistory } from "history";
import { readMessage } from "openpgp";
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
      // void store.authStore.fetchUser();
    }

    readMessage({
      armoredMessage:
        "-----BEGIN PGP SIGNED MESSAGE-----Hash: SHA51281666710-6797-4b40-8e8e-00c715720163-----BEGIN PGP SIGNATURE-----wsDzBAEBCgAnBYJnD373CZAgTn5IlI6cixYhBIwcsOTmKPDVBq1xBSBOfkiUjpyLAABo8wwApzYwEUkJzOV+7IP9FpEvizZXvhE8YRyz3dbteVgWZZcXlE/AH6g3kFK6A4HtO5yaCSOJP19A3BlICk1UKKkBMEPWH3Wyxk0Q4yAruSqokNjzJP3LMzyunojFXEpOthrsN893v+dkxght3YXWHAAGolq1CEBLgPEvZjZ5mxX5rZCBfiPcilb1AxyonJqywEix4TB08eaGKLJZ3snl2l4qeKC5vanVZZft57HMJF85qrSfK0B4PtZUbt5aMiLSEPm6RIndzGgB8CzAtng2tglrz5pJ2MhL4/nKl+EDAQinPNznn8psrV71slBt10cv1sqUmfb7Oa6GVmyeXZ98r3tan018lAxJSnfCVXW/0BWIZfWUCfKqPCcMQZQ29Cl6gEzVmb+4r+UxyFoqcFPouF+pr0UFoKySIZBbWy0Er6RAuHsuYwH7CcYxBaJZ6JkjBYYndVHYYAafXIGmgeKZz57ad8Q7g5dOdrTNDBZ7aRc81Uua2/69hQaY7VKonhCFgX0V=/SDj-----END PGP SIGNATURE-----",
    }).then(console.log);
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
