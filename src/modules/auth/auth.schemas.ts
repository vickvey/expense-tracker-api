import * as z from "zod";

export const authRegistrationSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(255),
});

export const authLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(255),
});
