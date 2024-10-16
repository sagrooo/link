type VerifyProps = {
  secret: string;
  otp: string;
  username: string;
  isSaveToStore?: boolean;
};

type SavePublicKeyProps = {
  publicKey: string;
  username: string;
};

type SavePrivateKeyProps = {
  privateKey: string;
  passphrase: string;
};

export enum PgpAuthStep {
  PublicKey = "publicKey",
  PrivateKey = "privateKey",
  EnterPassphrase = "enterPassphrase",
}

export type CreateAndSignProps = {
  username: string;
  passphrase: string;
  privateKey: string;
};

export type VerifySignedMessageProps = {
  username: string;
  signedMessage?: string;
};

export type ImplPgpAuthStore = {
  isLoading: boolean;

  step: PgpAuthStep;

  readonly savePublicKey: (props: SavePublicKeyProps) => Promise<void>;

  readonly savePrivateKey: (props: SavePrivateKeyProps) => Promise<void>;

  readonly verify: (props: VerifyProps) => Promise<void>;

  readonly setStep: (step: PgpAuthStep) => void;
};
