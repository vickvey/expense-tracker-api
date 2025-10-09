// auth.routes.ts

import * as AuthController from "./auth.controller";
import validateSchema from "@/middlewares/validate-schema";
import { Router } from "express";
import { authLoginSchema, authRegistrationSchema } from "./auth.schemas";

const router = Router();

router.post(
  "/sign-up",
  validateSchema(authRegistrationSchema),
  AuthController.register
);

router.post("/sign-in", validateSchema(authLoginSchema), AuthController.login);

router.post("/sign-out", AuthController.logout);

export default router;
