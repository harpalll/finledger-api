import { prisma } from "../../config/db";
import { logAudit } from "../../utils/auditLogger";
import {
  AuditAction,
  AuditEntity,
  Category,
  TransactionType,
} from "../../../generated/prisma/enums";
import type { FinancialRecordWhereInput } from "../../../generated/prisma/models";
import type { CreateRecordInput, User } from "../../types";
import { Parser } from "json2csv";
import * as XLSX from "xlsx";

export const createRecordService = async (
  data: CreateRecordInput,
  currentUser: User,
) => {
  const record = await prisma.financialRecord.create({
    data: {
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: new Date(data.date),
      notes: data.notes,
      userId: currentUser.userId,
    },
  });

  logAudit({
    action: AuditAction.CREATE,
    entity: AuditEntity.FINANCIAL_RECORD,
    entityId: record.id,
    userId: currentUser.userId,
  }).catch(console.error);

  return record;
};

export const getRecordsService = async (query: any) => {
  const { type, category, startDate, endDate, page = 1, limit = 10 } = query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Math.min(Number(limit), 100);

  const where: FinancialRecordWhereInput = {
    isDeleted: false,
  };

  if (type && !Object.values(TransactionType).includes(type)) {
    throw new Error(`Invalid type: ${type}`);
  }

  if (category && !Object.values(Category).includes(category)) {
    throw new Error(`Invalid category: ${category}`);
  }

  if (type) {
    where.type = type;
  }

  if (category) {
    where.category = category;
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take,
    }),
    prisma.financialRecord.count({ where }),
  ]);

  return {
    data: records,
    pagination: {
      total,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

export const getRecordByIdService = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!record) {
    throw new Error("Record not found");
  }

  return record;
};

export const updateRecordService = async (
  id: string,
  data: CreateRecordInput,
  currentUser: User,
) => {
  const existing = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw new Error("Record not found");
  }

  const updated = await prisma.financialRecord.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });

  logAudit({
    action: AuditAction.UPDATE,
    entity: AuditEntity.FINANCIAL_RECORD,
    entityId: id,
    userId: currentUser.userId,
    metadata: {
      oldData: existing,
      newData: data,
    },
  }).catch(console.error);

  return updated;
};

export const deleteRecordService = async (id: string, currentUser: User) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });

  if (!record) {
    throw new Error("Record not found");
  }

  await prisma.financialRecord.update({
    where: { id },
    data: { isDeleted: true },
  });

  logAudit({
    action: AuditAction.DELETE,
    entity: AuditEntity.FINANCIAL_RECORD,
    entityId: id,
    userId: currentUser.userId,
  }).catch(console.error);

  return { message: "Record deleted successfully", id };
};

export const exportRecordsService = async (query: any) => {
  const { type, category, startDate, endDate, format } = query;

  const where: FinancialRecordWhereInput = {
    isDeleted: false,
  };

  if (type) where.type = type;
  if (category) where.category = category;

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const records = await prisma.financialRecord.findMany({
    where,
    orderBy: { date: "desc" },
  });

  const formatted = records.map((r) => ({
    "Record ID": r.id,
    Amount: Number(r.amount),
    Type: r.type,
    Category: r.category,
    Date: r.date.toISOString(),
    Notes: r.notes || "",
    "Created At": r.createdAt.toISOString(),
  }));

  if (!format || format === "csv") {
    const parser = new Parser();
    return {
      type: "csv",
      data: parser.parse(formatted),
    };
  }

  if (format === "excel") {
    const worksheet = XLSX.utils.json_to_sheet(formatted);
    worksheet["!cols"] = [
      { wch: 36 }, // ID
      { wch: 12 }, // Amount
      { wch: 12 }, // Type
      { wch: 18 }, // Category
      { wch: 22 }, // Date
      { wch: 30 }, // Notes
      { wch: 22 }, // CreatedAt
    ];

    const headerKeys = Object.keys(formatted[0] || {});
    headerKeys.forEach((key, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });

      if (!worksheet[cellAddress]) return;

      worksheet[cellAddress].s = {
        font: { bold: true },
      };
    });

    formatted.forEach((row, i) => {
      const excelRow = i + 1;

      const dateCell = XLSX.utils.encode_cell({
        r: excelRow,
        c: 4,
      });

      if (worksheet[dateCell]) {
        worksheet[dateCell].z = "yyyy-mm-dd hh:mm";
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Records");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return {
      type: "excel",
      data: buffer,
    };
  }

  throw new Error("Invalid export format");
};
