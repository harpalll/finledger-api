import { Router } from "express";
import { createUser, getUsers, updateUser } from "./user.controller";
import { validateData } from "../../middleware/validation.middleware";
import { createUserSchema, updateUserSchema } from "./user.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/role.middleware";
import { Permission } from "../../config/permissions";

const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [VIEWER, ANALYST, ADMIN]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post(
  "/",
  authMiddleware,
  requirePermission(Permission.CREATE_USER),
  validateData(createUserSchema),
  createUser,
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Supports filtering by role and status.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [VIEWER, ANALYST, ADMIN]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
router.get(
  "/",
  authMiddleware,
  requirePermission(Permission.READ_USER),
  getUsers,
);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user details
 *     description: Update name, role, or status of a user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [VIEWER, ANALYST, ADMIN]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid update or forbidden action
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id",
  authMiddleware,
  requirePermission(Permission.UPDATE_USER),
  validateData(updateUserSchema),
  updateUser,
);

export default router;
