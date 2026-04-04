import { Router } from "express";
import { login } from "./auth.controller";
import { validateData } from "../../middleware/validation.middleware";
import { loginSchema } from "./auth.validation";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", validateData(loginSchema), login);

export default router;
