import type {
  Category,
  Role,
  TransactionType,
  UserStatus,
} from "../../generated/prisma/enums";
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

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
  status?: UserStatus;
}

export interface UpdateUserInput {
  name?: string;
  role?: Role;
  status?: UserStatus;
}

export interface CreateRecordInput {
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
  notes?: string;
}
