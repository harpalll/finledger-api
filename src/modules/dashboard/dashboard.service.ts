import { prisma } from "../../config/db";
import { TransactionType } from "../../../generated/prisma/enums";

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
    by: ["category"],
    _sum: { amount: true },
    where: {
      isDeleted: false,
    },
  });

  return result.map((item) => ({
    category: item.category,
    total: Number(item._sum.amount || 0),
  }));
};

export const getRecentActivityService = async () => {
  return prisma.financialRecord.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
};

export const getTrendsService = async () => {
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { date: "asc" },
  });

  const monthlyMap: Record<string, { income: number; expense: number }> = {};

  records.forEach((record) => {
    const month = record.date.toISOString().slice(0, 7);

    if (!monthlyMap[month]) {
      monthlyMap[month] = { income: 0, expense: 0 };
    }

    if (record.type === "INCOME") {
      monthlyMap[month].income += Number(record.amount);
    } else {
      monthlyMap[month].expense += Number(record.amount);
    }
  });

  return Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    ...data,
  }));
};
