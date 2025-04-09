import {Router} from "express";
import employeeRoutes from './employeeRoutes';
import expenseRoutes from './expenseRoutes';
import inventoryRoutes from './inventoryRoutes';
import vendorRoutes from './vendorRoutes';




const router = Router();

router.use('/employees', employeeRoutes)
router.use('/expenses', expenseRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/vendors', vendorRoutes)

export default router;