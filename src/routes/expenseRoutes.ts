import {Router} from 'express';
import * as expenseController from "../controllers/expenseController";
import { expenseValidationRules, validateExpense } from "../validators/expenseValidator";


const router = Router();

router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById);
router.post('/', expenseValidationRules(), validateExpense, expenseController.createExpense);
router.put('/:id', expenseValidationRules(), validateExpense, expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;