import { Router } from "express";
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  exportRecords,
} from "./record.controller";
import { validateData } from "../../middleware/validation.middleware";
import { createRecordSchema, updateRecordSchema } from "./record.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/role.middleware";
import { Permission } from "../../config/permissions";

const router = Router();

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *                 enum: [SALARY, FREELANCE, INVESTMENT, RENT, FOOD, TRANSPORT, UTILITIES, HEALTHCARE, ENTERTAINMENT, EDUCATION, OTHER]
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *                 example: Rent payment
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  authMiddleware,
  requirePermission(Permission.CREATE_RECORD),
  validateData(createRecordSchema),
  createRecord,
);

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all financial records
 *     description: Supports filtering, pagination, and date range queries.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [SALARY, FREELANCE, INVESTMENT, RENT, FOOD, TRANSPORT, UTILITIES, HEALTHCARE, ENTERTAINMENT, EDUCATION, OTHER]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *           description: Maximum 100
 *     responses:
 *       200:
 *         description: Records fetched successfully
 */
router.get(
  "/",
  authMiddleware,
  requirePermission(Permission.READ_RECORD),
  getRecords,
);

/**
 * @swagger
 * /records/export:
 *   get:
 *     summary: Export records as CSV or Excel
 *     description: Supports filtering and format selection (csv or excel).
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, excel]
 *           example: excel
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [SALARY, FREELANCE, INVESTMENT, RENT, FOOD, TRANSPORT, UTILITIES, HEALTHCARE, ENTERTAINMENT, EDUCATION, OTHER]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: File download (CSV or Excel)
 */
router.get(
  "/export",
  authMiddleware,
  requirePermission(Permission.READ_RECORD),
  exportRecords,
);

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a single record by ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record fetched successfully
 *       404:
 *         description: Record not found
 */
router.get(
  "/:id",
  authMiddleware,
  requirePermission(Permission.READ_RECORD),
  getRecordById,
);

/**
 * @swagger
 * /records/{id}:
 *   patch:
 *     summary: Update a financial record
 *     tags: [Records]
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
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *                 enum: [SALARY, FREELANCE, INVESTMENT, RENT, FOOD, TRANSPORT, UTILITIES, HEALTHCARE, ENTERTAINMENT, EDUCATION, OTHER]
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       400:
 *         description: Invalid input
 */
router.patch(
  "/:id",
  authMiddleware,
  requirePermission(Permission.UPDATE_RECORD),
  validateData(updateRecordSchema),
  updateRecord,
);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Delete a financial record (soft delete)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 */
router.delete(
  "/:id",
  authMiddleware,
  requirePermission(Permission.DELETE_RECORD),
  deleteRecord,
);

export default router;
