import {Router} from 'express';
import {
    createExpense,
    deleteExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense
} from "../controllers/expenseController";
import { IExpense } from "../models/Expense";


const router = Router();

router.get('/', getAllExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;