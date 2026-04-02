import { z } from "zod";
import { Role, UserStatus } from "../../../generated/prisma/client";

export const createUserSchema = z.object({
  name: z.string({ error: "Name is required" }),

  email: z.string({ error: "Email is required" }).email("Invalid email format"),

  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),

  role: z.nativeEnum(Role).optional(),

  status: z.nativeEnum(UserStatus).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),

  role: z.nativeEnum(Role).optional(),

  status: z.nativeEnum(UserStatus).optional(),
});
