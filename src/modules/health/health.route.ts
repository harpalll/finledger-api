import { Router } from "express";
import { prisma } from "../../config/db";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns API health status, uptime, version, and dependency health checks.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             example:
 *               status: OK
 *               version: v1
 *               uptime: 12345.67
 *               timestamp: 2026-04-04T20:00:00.000Z
 *               services:
 *                 database: OK
 *       503:
 *         description: API is degraded due to dependency failure
 *         content:
 *           application/json:
 *             example:
 *               status: DEGRADED
 *               version: v1
 *               uptime: 12345.67
 *               timestamp: 2026-04-04T20:00:00.000Z
 *               services:
 *                 database: DOWN
 */
router.get("/", async (_, res) => {
  let dbStatus = "OK";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    dbStatus = "DOWN";
  }

  const isHealthy = dbStatus === "OK";

  const response = {
    status: isHealthy ? "OK" : "DEGRADED",
    version: "v1",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
    },
  };

  return res.status(isHealthy ? 200 : 503).json(response);
});

export default router;
