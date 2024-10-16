import { WebStream } from "openpgp";

type VerifyProps = {
  secret: string | null;
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
  username: WebStream<string>;
  signedMessage?: string;
};

export type ImplPgpAuthStore = {
  isLoading: boolean;

  step: PgpAuthStep;

  readonly savePublicKey: (props: SavePublicKeyProps) => Promise<void>;

  readonly savePrivateKey: (props: SavePrivateKeyProps) => Promise<void>;

  readonly verify: (props: VerifyProps) => Promise<void>;

  readonly getStoredArmoredPrivateKey: (passphrase: string) => Promise<string>;

  readonly setStep: (step: PgpAuthStep) => void;
};
