import { RouterStore } from "@ibm/mobx-react-router";

import {
  GoogleAuthStore,
  ImplGoogleAuthStore,
} from "@/shared/store/google-auth-store";
import { ImplPgpAuthStore, PgpAuthStore } from "@/shared/store/pgp-auth-store";

import { AuthStore } from "./auth-store";

export class RootStore {
  authStore: AuthStore;

  googleAuthStore: ImplGoogleAuthStore;

  pgpAuthStore: ImplPgpAuthStore;

  routingStore: RouterStore;

  constructor(readonly router: RouterStore) {
    this.routingStore = router;

    this.authStore = new AuthStore(router);

    this.googleAuthStore = new GoogleAuthStore();

    this.pgpAuthStore = new PgpAuthStore();
  }
}
