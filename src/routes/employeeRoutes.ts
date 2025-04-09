import {Router} from 'express';
import {
    createEmployee,
    deleteEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee
} from "../controllers/employeeController";

const router = Router();

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;

