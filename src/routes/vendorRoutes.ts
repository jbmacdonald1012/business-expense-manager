import { Router } from 'express';
import * as vendorController from '../controllers/vendorController';
import {validateVendor, vendorValidationRules} from "../validators/vendorValidator";

const router = Router();

router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);
router.post('/', vendorValidationRules(), validateVendor, vendorController.createVendor);
router.put('/:id', vendorValidationRules(), validateVendor, vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);

export default router;