import * as z from "zod";
import * as schema from "@/db/schema";

const amountValidation = z
  .number()
  .gt(0)
  .lt(100_000_000, { error: "Tere baap ke paas hai itte paise!!" });

const categoryValidation = z.enum(schema.CATEGORY_ENUM_VALUES);

const descriptionValidation = z.string().max(255);

const dateValidation = z
  .string()
  .transform((str) => {
    // Convert "YYYY-MM-DD HH:MM:SS" into a format that JavaScript Date can parse
    const date = new Date(str); // JavaScript can parse "YYYY-MM-DD HH:MM:SS"
    return date;
  })
  .refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date-time format",
  }); // Check if the date is valid

export const expenseCreateSchema = z.object({
  amount: amountValidation,
  category: categoryValidation,
  description: descriptionValidation.optional(),
  date: dateValidation,
  userId: z.int(),
});

export const expenseUpdateSchema = z.object({
  amount: amountValidation.optional(),
  category: categoryValidation.optional(),
  description: descriptionValidation.optional(),
  date: dateValidation.optional(),
  userId: z.int().optional(),
});
