import { AuthStore } from "./auth-store";

export class RootStore {
  authStore: AuthStore;

  constructor(routingStore) {
    this.authStore = new AuthStore(routingStore);
  }
}
