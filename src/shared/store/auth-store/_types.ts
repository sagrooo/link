export type SignUpParams = {
  username: string;
  password: string;
  email?: string;
};

export type LoginParams = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export enum TwoFactorType {
  Google = "google",
  Pgp = "pgp",
}

type BaseJwtPayload = {
  username: string;
  email: string | null;
  challenges: string | null;
  expiresAt: string;
};

type PayloadWithTwoFactor = BaseJwtPayload & {
  twoFactorType: TwoFactorType;
  secret: string;
};

type PaylodWithoutTwoFactor = BaseJwtPayload & {
  twoFactorType: null;
  secret: null;
};

export type JwtPayload = PaylodWithoutTwoFactor | PayloadWithTwoFactor;
