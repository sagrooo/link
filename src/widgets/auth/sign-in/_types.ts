import { z } from "zod";

export const FormValues = z.object({
  username: z
    .string()
    .min(3, "Username должен быть 3 символа и более")
    .max(20, "Username must be at most 20 characters long"),
  password: z
    .string()
    .min(8, "Пароль должен быть 8 символов и более")
    .max(100, "Password must be at most 100 characters long"),
});

export enum FormFieldNames {
  Username = "username",
  Password = "password",
}

export type FormValues = Record<FormFieldNames, string>;
