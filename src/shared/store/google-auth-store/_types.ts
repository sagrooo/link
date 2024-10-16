type VerifyProps = {
  secret: string | null;
  otp: string;
  username: string;
};

export type ImplGoogleAuthStore = {
  isLoading: boolean;

  otpModel: GenerateOtpResponse | null;

  step: AuthStep;

  readonly verify: (props: VerifyProps) => Promise<void>;
  readonly generate: (username: string) => Promise<void>;
  readonly goToVerify: () => void;
};

export type GenerateOtpResponse = {
  otpauthUrl: string;
  secret: string;
};

export enum AuthStep {
  ScanQr = "scanQr",
  Verify = "verify",
}
