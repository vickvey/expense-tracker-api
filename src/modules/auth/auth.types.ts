import * as z from "zod";
import { authLoginSchema, authRegistrationSchema } from "./auth.schemas";

export type AuthRegistrationDTO = z.infer<typeof authRegistrationSchema>;

export type AuthLoginDTO = z.infer<typeof authLoginSchema>;

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  exp: number; // The expiration timestamp (optional but good to keep)
  iat: number; // The issued at timestamp (optional but good to keep)
}
