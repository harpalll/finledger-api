import { Router } from "express";
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "./record.controller";
import { validateData } from "../../middleware/validation.middleware";
import { createRecordSchema, updateRecordSchema } from "./record.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/role.middleware";
import { Permission } from "../../config/permissions";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requirePermission(Permission.CREATE_RECORD),
  validateData(createRecordSchema),
  createRecord,
);

router.get(
  "/",
  authMiddleware,
  requirePermission(Permission.READ_RECORD),
  getRecords,
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission(Permission.READ_RECORD),
  getRecordById,
);

router.patch(
  "/:id",
  authMiddleware,
  requirePermission(Permission.UPDATE_RECORD),
  validateData(updateRecordSchema),
  updateRecord,
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission(Permission.DELETE_RECORD),
  deleteRecord,
);

export default router;
