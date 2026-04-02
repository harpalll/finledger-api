import type { Role } from "../../generated/prisma/enums";
import { AuditAction, AuditEntity } from "../../generated/prisma/enums";

export type errorMessage = {
  field?: string;
  message: string;
};

export interface User {
  userId: string;
  role: Role;
}

export type AuditLogParams = {
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  userId: string;
  metadata?: any;
};
