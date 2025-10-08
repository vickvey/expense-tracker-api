import { relations } from "drizzle-orm";
import { expensesTable, usersTable } from "./schema";

export const usersRelations = relations(usersTable, ({ many }) => ({
  expenses: many(expensesTable),
}));

export const expensesRelations = relations(expensesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [expensesTable.userId],
    references: [usersTable.id],
  }),
}));
