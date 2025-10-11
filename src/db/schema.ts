import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

export const usersTable = t.sqliteTable("users", {
  id: t.int().primaryKey({ autoIncrement: true }),
  email: t.text().notNull().unique(),
  passwordHash: t.text("password_hash").notNull(),
  role: t
    .text({ enum: ["standard", "admin"] })
    .default("standard")
    .notNull(),
});

export const CATEGORY_ENUM_VALUES = [
  "Groceries",
  "Leisure",
  "Electronics",
  "Utilities",
  "Clothing",
  "Health",
  "Others",
] as const;

export const expensesTable = t.sqliteTable(
  "expenses",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    amount: t.real().notNull(),
    category: t.text({ enum: CATEGORY_ENUM_VALUES }).notNull(),
    description: t.text(),
    date: t
      .text()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    userId: t
      .int("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [t.index("users_date_idx").on(table.userId, table.date)]
);
