import bcrypt from "bcrypt";
import { prisma } from "../../config/db";
import {
  AuditAction,
  AuditEntity,
  Role,
  UserStatus,
} from "../../../generated/prisma/enums";
import type { User } from "../../types";
import { logAudit } from "../../utils/auditLogger";

export const createUserService = async (
  data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
    status?: UserStatus;
  },
  currentUser: User,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      role: data.role || Role.VIEWER,
      status: data.status || UserStatus.ACTIVE,
    },
  });

  logAudit({
    action: AuditAction.CREATE,
    entity: AuditEntity.USER,
    entityId: user.id,
    userId: currentUser.userId,
    metadata: {
      createdUserEmail: user.email,
      role: user.role,
    },
  }).catch(console.error);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

export const getUsersService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return users;
};

export const updateUserService = async (
  userId: string,
  data: {
    name?: string;
    role?: Role;
    status?: UserStatus;
  },
  currentUser: User,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (currentUser.userId === userId && data.role) {
    throw new Error("You cannot change your own role");
  }

  if (currentUser.userId === userId && data.status === "INACTIVE") {
    throw new Error("You cannot deactivate yourself");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  // fire-and-forget audit log
  logAudit({
    action: AuditAction.UPDATE,
    entity: AuditEntity.USER,
    entityId: userId,
    userId: currentUser.userId,
    metadata: {
      oldData: {
        role: user.role,
        status: user.status,
      },
      newData: data,
    },
  }).catch(console.error);

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    status: updatedUser.status,
  };
};
