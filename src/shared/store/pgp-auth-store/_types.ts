type VerifyProps = {
  otp: string;
  username: string;
  secret: string;
};

type SavePublicKeyProps = {
  publicKey: string;
  username: string;
};

type EncryptPrivateKeyProps = {
  passphrase: string;
  privateKey: string;
};
export enum PgpAuthStep {
  PublicKey = "publicKey",
  PrivateKey = "privateKey",
  EnterPassphrase = "enterPassphrase",
}

export type ImplPgpAuthStore = {
  isLoading: boolean;

  step: PgpAuthStep;

  readonly savePublicKey: (props: SavePublicKeyProps) => void;

  readonly verify: (props: VerifyProps) => Promise<void>;

  readonly setStep: (step: PgpAuthStep) => void;

  readonly encryptPrivateKey: (values: EncryptPrivateKeyProps) => Promise<void>;

  readonly decryptPrivateKey: (passphrase: string) => Promise<void>;
};
