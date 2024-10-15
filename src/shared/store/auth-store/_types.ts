export type SignUpParams = {
  username: string;
  password: string;
  email?: string;
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

export type GenerateOtpSecretResponse = {
  otpauthUrl: string;
  secret: string;
};
