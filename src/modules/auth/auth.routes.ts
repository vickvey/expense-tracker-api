import validateSchema from "@/middlewares/validate-schema";
import { Router } from "express";
import { authLoginSchema, authRegistrationSchema } from "./auth.schemas";

const router = Router();

router.post("/sign-up", validateSchema(authRegistrationSchema), registerUser);

router.post("/sign-in", validateSchema(authLoginSchema), loginUser);

router.post("/sign-out", logoutUser);

export default router;
