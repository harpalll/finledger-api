import type { User } from ".";
import { Role } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
