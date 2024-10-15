import { z } from "zod";

export const FormValues = z.object({
  otp: z.string().min(6),
});

export type FormValues = z.infer<typeof FormValues>;
