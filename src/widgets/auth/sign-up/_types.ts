import { z } from "zod";

export const FormValues = z
  .object({
    username: z
      .string()
      .min(3, "Username должен быть 3 символа и более")
      .max(20, "Username must be at most 20 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    password: z
      .string()
      .min(8, "Пароль должен быть 8 символов и более")
      .max(100, "Password must be at most 100 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Пароль должен быть 8 символов и более")
      .max(100, "Password must be at most 100 characters long"),
    email: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export enum FormFieldNames {
  Email = "email",
  Username = "username",
  Password = "password",
  ConfirmPassword = "confirmPassword",
}

export type FormValues = Record<FormFieldNames, string>;
