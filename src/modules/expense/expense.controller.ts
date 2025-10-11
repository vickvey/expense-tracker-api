import { NextFunction, Request, Response } from "express";
import * as ExpenseService from "./expense.service";

const getAll = () => {};
const getOne = () => {};

const handleCreateExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.currentUser?.userId;
    const body = req.body;
    await ExpenseService.createExpense({
      amount: body.amount,
      category: body.category,
      userId: userId,
      description: body.description,
    });
  } catch (error) {}
};

const updateOne = () => {};
const deleteOne = () => {};

export { getAll, getOne, handleCreateExpense, updateOne, deleteOne };
