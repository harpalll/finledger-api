export enum Permission {
  CREATE_USER = "CREATE_USER",
  READ_USER = "READ_USER",
  UPDATE_USER = "UPDATE_USER",

  CREATE_RECORD = "CREATE_RECORD",
  READ_RECORD = "READ_RECORD",
  UPDATE_RECORD = "UPDATE_RECORD",
  DELETE_RECORD = "DELETE_RECORD",

  READ_DASHBOARD = "READ_DASHBOARD",
}

import type { Role } from "../../generated/prisma/enums";

export const rolePermissions: Record<Role, Permission[]> = {
  VIEWER: [Permission.READ_DASHBOARD],

  ANALYST: [Permission.READ_DASHBOARD, Permission.READ_RECORD],

  ADMIN: [
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,

    Permission.CREATE_RECORD,
    Permission.READ_RECORD,
    Permission.UPDATE_RECORD,
    Permission.DELETE_RECORD,

    Permission.READ_DASHBOARD,
  ],
};
