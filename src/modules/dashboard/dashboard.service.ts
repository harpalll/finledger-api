import { prisma } from "../../config/db";
import { TransactionType } from "../../../generated/prisma/enums";
import type {
  Category,
  FinancialRecord,
} from "../../../generated/prisma/client";

export const getSummaryService = async () => {
  const income = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: {
      type: TransactionType.INCOME,
      isDeleted: false,
    },
  });

  const expense = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: {
      type: TransactionType.EXPENSE,
      isDeleted: false,
    },
  });

  const totalIncome = Number(income._sum.amount || 0);
  const totalExpense = Number(expense._sum.amount || 0);

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
};

export const getCategoryBreakdownService = async () => {
  const result = await prisma.financialRecord.groupBy({
    by: ["category", "type"],
    _sum: { amount: true },
    where: { isDeleted: false },
  });

  const map = {} as Record<
    Category,
    { category: Category; income: number; expense: number }
  >;

  result.forEach((item) => {
    if (!map[item.category]) {
      map[item.category] = {
        category: item.category,
        income: 0,
        expense: 0,
      };
    }

    if (item.type === TransactionType.INCOME) {
      map[item.category].income = Number(item._sum.amount || 0);
    } else {
      map[item.category].expense = Number(item._sum.amount || 0);
    }
  });

  return Object.values(map);
};

export const getRecentActivityService = async (limit = 5) => {
  return prisma.financialRecord.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: Math.min(limit, 20),
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      notes: true,
    },
  });
};

export const getTrendsService = async () => {
  const result = await prisma.financialRecord.groupBy({
    by: ["date", "type"],
    _sum: { amount: true },
    where: { isDeleted: false },
  });

  const monthlyMap: Record<string, { income: number; expense: number }> = {};

  result.forEach((item) => {
    const month = item.date.toISOString().slice(0, 7); // "2024-01"
    if (!monthlyMap[month]) monthlyMap[month] = { income: 0, expense: 0 };

    if (item.type === TransactionType.INCOME) {
      monthlyMap[month].income += Number(item._sum.amount || 0);
    } else {
      monthlyMap[month].expense += Number(item._sum.amount || 0);
    }
  });

  return Object.entries(monthlyMap)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));
};
