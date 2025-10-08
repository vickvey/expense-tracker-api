import * as z from "zod";
import { authLoginSchema, authRegistrationSchema } from "./auth.schemas";

export type AuthRegistrationDTO = z.infer<typeof authRegistrationSchema>;
export type AuthLoginDTO = z.infer<typeof authLoginSchema>;
