import {
  Role,
  UserStatus,
  TransactionType,
  Category,
} from "../generated/prisma/client";

import bcrypt from "bcrypt";
import { prisma } from "../src/config/db";

async function main() {
  console.log("🌱 Seeding started...");

  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@test.com",
      passwordHash: password,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: "analyst@test.com" },
    update: {},
    create: {
      name: "Analyst User",
      email: "analyst@test.com",
      passwordHash: password,
      role: Role.ANALYST,
      status: UserStatus.ACTIVE,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: "viewer@test.com" },
    update: {},
    create: {
      name: "Viewer User",
      email: "viewer@test.com",
      passwordHash: password,
      role: Role.VIEWER,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("Users seeded");

  await prisma.financialRecord.createMany({
    data: [
      {
        amount: 50000,
        type: TransactionType.INCOME,
        category: Category.SALARY,
        date: new Date(),
        notes: "Monthly salary",
        userId: admin.id,
      },
      {
        amount: 5000,
        type: TransactionType.EXPENSE,
        category: Category.FOOD,
        date: new Date(),
        notes: "Groceries",
        userId: admin.id,
      },
      {
        amount: 2000,
        type: TransactionType.EXPENSE,
        category: Category.TRANSPORT,
        date: new Date(),
        notes: "Fuel",
        userId: analyst.id,
      },
      {
        amount: 10000,
        type: TransactionType.INCOME,
        category: Category.FREELANCE,
        date: new Date(),
        notes: "Side project",
        userId: analyst.id,
      },
    ],
  });

  console.log("Financial records seeded");

  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "USER",
      entityId: admin.id,
      userId: admin.id,
      metadata: { note: "Seeded admin user" },
    },
  });

  console.log("Audit logs seeded");

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
