import * as z from "zod";
import { expenseCreateSchema, expenseUpdateSchema } from "./expense.schemas";

export type ExpenseCreateDTO = z.infer<typeof expenseCreateSchema>;
export type ExpenseUpdateDTO = z.infer<typeof expenseUpdateSchema>;
