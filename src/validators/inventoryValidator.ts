import { body, ValidationChain, validationResult } from 'express-validator';

export const inventoryValidationRules = (): ValidationChain[] => {
    return [
        body('product')
            .notEmpty()
            .withMessage('Product name is required.'),
        body('description')
            .notEmpty()
            .withMessage('Description is required.'),
        body('pricePerUnit')
            .isNumeric()
            .withMessage('Price per unit must be a number.'),
        body('quantity')
            .isInt({ min: 0 })
            .withMessage('Quantity must be a non-negative integer.')
    ];
};

export const validateInventory = (req: any, res: any, next: any): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};