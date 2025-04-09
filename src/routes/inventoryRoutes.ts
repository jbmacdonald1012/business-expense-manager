import { Router } from 'express';
import * as inventoryController from '../controllers/inventoryController';
import { inventoryValidationRules, validateInventory } from "../validators/inventoryValidator";

const router = Router();

router.get('/', inventoryController.getAllInventory);
router.get('/:id', inventoryController.getInventoryById);
router.post('/', inventoryValidationRules(), validateInventory, inventoryController.createInventory);
router.put('/:id', inventoryValidationRules(), validateInventory, inventoryController.updateInventory);
router.delete('/:id', inventoryController.deleteInventory);

export default router;