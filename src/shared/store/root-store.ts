import { RouterStore } from "@ibm/mobx-react-router";

import { GoogleAuthStore } from "@/shared/store/google-auth-store/index.ts";

import { AuthStore } from "./auth-store";

export class RootStore {
  authStore: AuthStore;

  routingStore: RouterStore;

  constructor(private readonly routingStore: RouterStore) {
    this.routingStore = routingStore;
    this.authStore = new AuthStore(routingStore);
  }

  newGoogleAuthStore = () => new GoogleAuthStore(this.routingStore);
}
