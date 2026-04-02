import type { Role } from "../../generated/prisma/enums";

export type errorMessage = {
  field?: string;
  message: string;
};

export interface User {
  userId: number;
  role: Role;
}
