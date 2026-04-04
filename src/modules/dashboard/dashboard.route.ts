import { Router } from "express";
import {
  getSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getTrends,
} from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/role.middleware";
import { Permission } from "../../config/permissions";

const router = Router();

router.get(
  "/summary",
  authMiddleware,
  requirePermission(Permission.READ_DASHBOARD),
  getSummary,
);

router.get(
  "/categories",
  authMiddleware,
  requirePermission(Permission.READ_DASHBOARD),
  getCategoryBreakdown,
);

router.get(
  "/recent",
  authMiddleware,
  requirePermission(Permission.READ_DASHBOARD),
  getRecentActivity,
);

router.get(
  "/trends",
  authMiddleware,
  requirePermission(Permission.READ_RECORD),
  getTrends,
);

export default router;
