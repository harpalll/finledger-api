import { z } from "zod";
import { TransactionType, Category } from "../../../generated/prisma/enums";

export const createRecordSchema = z.object({
  amount: z
    .number({ error: "Amount is required" })
    .positive("Amount must be greater than 0"),

  type: z.nativeEnum(TransactionType),

  category: z.nativeEnum(Category),

  date: z.string({ error: "Date is required" }),

  notes: z.string().optional(),
});

export const updateRecordSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  category: z.nativeEnum(Category).optional(),
  date: z.string().optional(),
  notes: z.string().optional(),
});
