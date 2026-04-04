import { Router } from "express";
import {
  getSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getTrends,
  getDashboard,
} from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/role.middleware";
import { Permission } from "../../config/permissions";

const router = Router();

// combined single endpoint
/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get complete dashboard data
 *     description: Returns aggregated dashboard data including summary, category breakdown, recent activity, and trends.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 summary:
 *                   totalIncome: 60000
 *                   totalExpense: 15000
 *                   netBalance: 45000
 *                 categories:
 *                   - category: FOOD
 *                     income: 0
 *                     expense: 5000
 *                 recent: []
 *                 trends: []
 *               error: null
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  authMiddleware,
  requirePermission(Permission.READ_DASHBOARD),
  getDashboard,
);

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get financial summary
 *     description: Returns total income, total expenses, and net balance.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 totalIncome: 60000
 *                 totalExpense: 15000
 *                 netBalance: 45000
 *               error: null
 */
router.get(
  "/summary",
  authMiddleware,
  requirePermission(Permission.READ_DASHBOARD),
  getSummary,
);

/**
 * @swagger
 * /dashboard/categories:
 *   get:
 *     summary: Get category-wise breakdown
 *     description: Returns income and expense totals grouped by category.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - category: FOOD
 *                   income: 0
 *                   expense: 5000
 *                 - category: SALARY
 *                   income: 50000
 *                   expense: 0
 *               error: null
 */
router.get(
  "/categories",
  authMiddleware,
  requirePermission(Permission.READ_DASHBOARD),
  getCategoryBreakdown,
);

/**
 * @swagger
 * /dashboard/recent:
 *   get:
 *     summary: Get recent transactions
 *     description: Returns the most recent financial records based on the provided limit.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Number of recent records to fetch (default can be applied if not provided)
 *     responses:
 *       200:
 *         description: Recent activity fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: "uuid-1"
 *                   amount: 5000
 *                   type: EXPENSE
 *                   category: FOOD
 *                   date: "2026-04-04T13:24:13.199Z"
 *                 - id: "uuid-2"
 *                   amount: 20000
 *                   type: INCOME
 *                   category: SALARY
 *                   date: "2026-04-03T10:00:00.000Z"
 *               error: null
 *       403:
 *         description: Forbidden
 */
router.get(
  "/recent",
  authMiddleware,
  requirePermission(Permission.READ_DASHBOARD),
  getRecentActivity,
);

/**
 * @swagger
 * /dashboard/trends:
 *   get:
 *     summary: Get financial trends
 *     description: Returns aggregated income and expense trends grouped by time period (monthly or weekly).
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         required: false
 *         schema:
 *           type: string
 *           enum: [monthly, weekly]
 *           example: monthly
 *         description: Time grouping for trends. Defaults to monthly if not provided.
 *     responses:
 *       200:
 *         description: Trends fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - period: "2026-04"
 *                   income: 50000
 *                   expense: 20000
 *                 - period: "2026-03"
 *                   income: 45000
 *                   expense: 15000
 *               error: null
 *       403:
 *         description: Forbidden
 */
router.get(
  "/trends",
  authMiddleware,
  requirePermission(Permission.READ_RECORD),
  getTrends,
);

export default router;
