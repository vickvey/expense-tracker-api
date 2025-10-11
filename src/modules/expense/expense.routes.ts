import { Router } from "express";
import * as ExpenseController from "./expense.controller";
import validateSchema from "@/middlewares/validate-schema";
import { expenseCreateSchema, expenseUpdateSchema } from "./expense.schemas";

const router = Router();

// router.get("/", ExpenseController.getAll);

// router.get("/:id", ExpenseController.getOne);

router.post(
  "/:id",
  validateSchema(expenseCreateSchema),
  ExpenseController.createOne
);

// router.put(
//   "/:id",
//   validateSchema(expenseUpdateSchema),
//   ExpenseController.updateOne
// );

// router.delete("/:id", ExpenseController.deleteOne);

export default router; // expenseRoutes
