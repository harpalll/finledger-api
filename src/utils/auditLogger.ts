import { prisma } from "../config/db";
import type { AuditLogParams } from "../types";

export const logAudit = async ({
  action,
  entity,
  entityId,
  userId,
  metadata,
}: AuditLogParams) => {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        userId,
        metadata,
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
};
