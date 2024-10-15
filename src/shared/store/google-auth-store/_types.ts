type VerifyProps = {
  secret: string;
  otp: string;
  username: string;
};

export type ImplGoogleAuthStore = {
  readonly verify: (props: VerifyProps) => Promise<void>;
  readonly generate: (username: string) => Promise<void>;
};

export type GenerateOtpResponse = {
  otpauthUrl: string;
  secret: string;
};
