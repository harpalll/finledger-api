import { Router } from "express";
import { login } from "./auth.controller";
import { validateData } from "../../middleware/validation.middleware";
import { loginSchema } from "./auth.validation";

const router = Router();

router.post("/login", validateData(loginSchema), login);

export default router;
