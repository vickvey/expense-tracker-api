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
      orderBy: {
        paymentDate: 'desc',
      },
    });
    ApiResponse.send(res, 200, `User expenses of User with Id: ${userId}`, expenses);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}

export async function getExpenseById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const expense = await prisma.expense.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!expense) {
      return ApiResponse.error(res, 404, `Expense with id: ${id} not found`);
    }

    ApiResponse.send(res, 200, `Expense with id: ${id}`, expense);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}

export async function createExpense(req, res) {
  try {
    const { amount, category, description, status, paymentDate } = req.body;
    const userId = req.userId;

    // Validate request data
    if (!amount || !category) {
      return ApiResponse.error(res, 400, 'Amount and category are required');
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        amount: parseFloat(amount),
        category,
        description: description || null,
        status: status || 'COMPLETED',
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      },
    });

    if (!expense) throw new Error(`Error creating expense`);
    ApiResponse.send(res, 201, `Expense with id: ${expense.id} successfully created`, expense);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}

export async function updateExpense(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { amount, category, description, status, paymentDate } = req.body;

    // Check if the expense exists and belongs to the user
    const existingExpense = await prisma.expense.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingExpense) {
      return ApiResponse.error(res, 404, `Expense with id: ${id} not found`);
    }

    // Update the expense
    const updatedExpense = await prisma.expense.update({
      where: {
        id,
      },
      data: {
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        category: category !== undefined ? category : undefined,
        description: description !== undefined ? description : undefined,
        status: status !== undefined ? status : undefined,
        paymentDate: paymentDate !== undefined ? new Date(paymentDate) : undefined,
      },
    });

    ApiResponse.send(res, 200, `Expense with id: ${id} successfully updated`, updatedExpense);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}

export async function patchExpense(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updateData = req.body;

    // Check if the expense exists and belongs to the user
    const existingExpense = await prisma.expense.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingExpense) {
      return ApiResponse.error(res, 404, `Expense with id: ${id} not found`);
    }

    // Prepare update data with type conversions
    if (updateData.amount !== undefined) {
      updateData.amount = parseFloat(updateData.amount);
    }

    if (updateData.paymentDate !== undefined) {
      updateData.paymentDate = new Date(updateData.paymentDate);
    }

    // Update the expense
    const patchedExpense = await prisma.expense.update({
      where: {
        id,
      },
      data: updateData,
    });

    ApiResponse.send(res, 200, `Expense with id: ${id} successfully patched`, patchedExpense);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Check if the expense exists and belongs to the user
    const existingExpense = await prisma.expense.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingExpense) {
      return ApiResponse.error(res, 404, `Expense with id: ${id} not found`);
    }

    // Delete the expense
    await prisma.expense.delete({
      where: {
        id,
      },
    });

    ApiResponse.send(res, 200, `Expense with id: ${id} successfully deleted`, null);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}
