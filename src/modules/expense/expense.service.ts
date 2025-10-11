import { db } from "@/db/client";
import { ExpenseCreateDTO } from "./expense.types";
import { expensesTable } from "@/db/schema";

const createExpense = async (dto: ExpenseCreateDTO) => {
  const res = await db.insert(expensesTable).values({
    amount: dto.amount,
    userId: dto.userId,
    category: dto.category,
    date: dto.date.toDateString(),
  });
  console.log(`Expense created for UserId: ${res.rows[0]}`);
};

export { createExpense };
