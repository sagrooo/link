type VerifyProps = {
  otp: string;
  username: string;
  secret: string;
};

type SetPgpKeyProps = {
  pgpKey: string;
  username: string;
  passphrase: string;
};

export enum PgpAuthStep {
  EnterKey = "enterKey",
  Verify = "verify",
}

export type ImplPgpAuthStore = {
  isLoading: boolean;

  step: PgpAuthStep;

  readonly createKey: (props: SetPgpKeyProps) => void;
  readonly verify: (props: VerifyProps) => Promise<void>;
  readonly onGotoVerify: () => void;
};
