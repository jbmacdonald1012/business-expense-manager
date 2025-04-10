"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVendor = exports.vendorValidationRules = void 0;
const express_validator_1 = require("express-validator");
const vendorValidationRules = () => {
    return [
        (0, express_validator_1.body)('companyName')
            .notEmpty()
            .withMessage('Company name is required.'),
        (0, express_validator_1.body)('products')
            .isArray()
            .withMessage('Products must be an array.'),
        (0, express_validator_1.body)('products.*')
            .isString()
            .withMessage('Each product in the array must be a string.'),
        (0, express_validator_1.body)('email')
            .isEmail()
            .withMessage('A valid email is required.'),
        (0, express_validator_1.body)('phoneNumber')
            .notEmpty()
            .withMessage('Phone number is required.'),
        (0, express_validator_1.body)('contactPerson')
            .notEmpty()
            .withMessage('Contact person is required.')
    ];
};
exports.vendorValidationRules = vendorValidationRules;
const validateVendor = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateVendor = validateVendor;
