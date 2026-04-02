import { Router } from "express";
import { createUser, getUsers, updateUser } from "./user.controller";
import { validateData } from "../../middleware/validation.middleware";
import { createUserSchema, updateUserSchema } from "./user.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/role.middleware";
import { Permission } from "../../config/permissions";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requirePermission(Permission.CREATE_USER),
  validateData(createUserSchema),
  createUser,
);

router.get(
  "/",
  authMiddleware,
  requirePermission(Permission.READ_USER),
  getUsers,
);

router.patch(
  "/:id",
  authMiddleware,
  requirePermission(Permission.UPDATE_USER),
  validateData(updateUserSchema),
  updateUser,
);

router.patch(
  "/:id/role",
  authMiddleware,
  requirePermission(Permission.UPDATE_USER),
  validateData(updateUserSchema.pick({ role: true })),
  updateUser,
);

router.patch(
  "/:id/status",
  authMiddleware,
  requirePermission(Permission.UPDATE_USER),
  validateData(updateUserSchema.pick({ status: true })),
  updateUser,
);

export default router;
