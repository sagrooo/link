import { jwtDecode } from "jwt-decode";
import { makeAutoObservable } from "mobx";

import { RouterStore } from "@ibm/mobx-react-router";

import { ROUTES } from "@/shared/_constants.ts";
import { functionsMapError } from "@/shared/lib/functions-map-error";
import { supabase } from "@/shared/services/supabase-client";

import { JwtPayload, LoginParams, LoginResponse, SignUpParams } from "./_types";

export class AuthStore {
  isLoading = false;

  error: string | null = null;

  token: string | null = null;

  isAuth = false;

  constructor(private routingStore: RouterStore) {
    const token = localStorage.getItem("token");

    if (token) {
      this.token = token;
      this.isAuth = true;
    }

    makeAutoObservable(this);
  }

  authenticateUser = () => {
    if (this.token === null) {
      return;
    }

    localStorage.setItem("token", this.token);
    this.isAuth = true;
    this.routingStore.history.push(ROUTES.home);
  };

  logout = () => {
    localStorage.removeItem("token");

    this.token = null;
    this.isAuth = false;

    this.routingStore.history.push(ROUTES.signIn);
  };

  login = async ({ username, password }: LoginParams) => {
    this.error = null;
    this.isLoading = true;

    try {
      const { data, error } = await supabase.functions.invoke<LoginResponse>(
        "sign-in",
        {
          body: {
            username,
            password,
          },
        },
      );

      if (error) {
        await functionsMapError(error);
      }

      if (data === null) {
        return;
      }

      const { twoFactorType } = jwtDecode<JwtPayload>(data.token);
      this.token = data.token;

      this.routingStore.history.push(
        twoFactorType !== null
          ? ROUTES.twoFactorPassphrase
          : ROUTES.configureTwoFactor,
      );
    } catch (e) {
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  signup = async ({ password, username, email }: SignUpParams) => {
    this.error = null;
    this.isLoading = true;
    try {
      const { error } = await supabase.functions.invoke<JwtPayload>("sign-up", {
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });

      if (error) {
        await functionsMapError(error);

        return;
      }

      this.routingStore.history.push(ROUTES.configureTwoFactor);
    } catch (e) {
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  checkAuth = async () => {
    this.isLoading = true;
    try {
      const { error } = await supabase.functions.invoke("check-auth", {
        body: JSON.stringify({
          token: this.token,
        }),
      });

      if (error) {
        this.logout();
      }
    } catch (e) {
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  get user() {
    if (!this.token) {
      return null;
    }
    return jwtDecode<JwtPayload>(this.token);
  }
}
