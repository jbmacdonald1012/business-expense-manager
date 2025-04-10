"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInventory = exports.inventoryValidationRules = void 0;
const express_validator_1 = require("express-validator");
const inventoryValidationRules = () => {
    return [
        (0, express_validator_1.body)('product')
            .notEmpty()
            .withMessage('Product name is required.'),
        (0, express_validator_1.body)('description')
            .notEmpty()
            .withMessage('Description is required.'),
        (0, express_validator_1.body)('pricePerUnit')
            .isNumeric()
            .withMessage('Price per unit must be a number.'),
        (0, express_validator_1.body)('quantity')
            .isInt({ min: 0 })
            .withMessage('Quantity must be a non-negative integer.')
    ];
};
exports.inventoryValidationRules = inventoryValidationRules;
const validateInventory = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateInventory = validateInventory;
