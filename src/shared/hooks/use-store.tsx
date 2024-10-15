import { createContext, useContext } from "react";

import { RootStore } from "@/shared/store/root-store";

export const StoreContext = createContext<RootStore | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
};
