export type SignUpParams = {
  username: string;
  password: string;
  email?: string;
};

export type LoginParams = {
  username: string;
  password: string;
};

export enum TwoFactorType {
  Google = "google",
  Pgp = "pgp",
}

export type User = {
  username: string;
  twoFactorType: TwoFactorType | null;
  email: string | null;
  secret: string | null;
  challenges: string | null;
};
