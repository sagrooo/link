import { z } from "zod";

const PgpKeySchema = z.string();

export const PublicKeyFormValues = z.object({
  key: PgpKeySchema.startsWith(
    "-----BEGIN PGP PUBLIC KEY BLOCK-----",
    "Ключ должен быть в виде публичного PGP ключа",
  ).endsWith(
    "-----END PGP PUBLIC KEY BLOCK-----",
    "Ключ должен быть в виде публичного PGP ключа",
  ),
});

export const PrivateKeyFormValues = z.object({
  key: PgpKeySchema.startsWith(
    "-----BEGIN PGP PRIVATE KEY BLOCK-----",
    "Ключ должен быть в виде приватного PGP ключа",
  ).endsWith(
    "-----END PGP PRIVATE KEY BLOCK-----",
    "Ключ должен быть в виде приватного PGP ключа",
  ),
  isSavePrivateKey: z.boolean().optional(),
});

export type FormValues = {
  key: string;
  isSavePrivateKey?: boolean;
};
