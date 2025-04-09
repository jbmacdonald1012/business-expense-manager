import {Router} from 'express';
import * as employeeController from "../controllers/employeeController";

import { employeeValidationRules, validateEmployee } from "../validators/employeeValidator";

const router = Router();

router.get('/',  employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeValidationRules(), validateEmployee, employeeController.createEmployee);
router.put('/:id', employeeValidationRules(), validateEmployee, employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export default router;

