import express from 'express';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  patchExpense,
  deleteExpense,
} from '../controllers/expenseController.js';

const router = express.Router();

// Get all expenses for the authenticated user
router.get('/', getExpenses);

// Get a specific expense by ID
router.get('/:id', getExpenseById);

// Create a new expense
router.post('/', createExpense);

// Update an expense completely (PUT)
router.put('/:id', updateExpense);

// Update an expense partially (PATCH)
router.patch('/:id', patchExpense);

// Delete an expense
router.delete('/:id', deleteExpense);

export default router;
