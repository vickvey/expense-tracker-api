import { prisma } from '../config/db.js';
import ApiResponse from '../utils/ApiResponse.js';

export async function getExpenses(req, res) {
  try {
    const userId = req.userId;
    console.log(`UserId: ${userId}`);
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
      },
    });
    ApiResponse.send(res, 200, `User expenses of User with Id: ${userId}`, expenses);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}

export async function createExpense(req, res) {
  try {
    const { amount, category } = req.body;
    const userId = req.userId;
    const expense = await prisma.expense.create({
      data: {
        userId,
        amount,
        category,
      },
    });
    if (!expense) throw new Error(`Error creating expense`);
    ApiResponse.send(res, 201, `Expense with id: ${expense.id} successfully created`, expense);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}
