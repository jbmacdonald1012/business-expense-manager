"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExpense = exports.expenseValidationRules = void 0;
const express_validator_1 = require("express-validator");
const expenseValidationRules = () => {
    return [
        (0, express_validator_1.body)('employeeName')
            .notEmpty()
            .withMessage('Employee name is required.'),
        (0, express_validator_1.body)('vendor')
            .notEmpty()
            .withMessage('Vendor is required.'),
        (0, express_validator_1.body)('description')
            .notEmpty()
            .withMessage('Description is required.'),
        (0, express_validator_1.body)('amount')
            .isNumeric()
            .withMessage('Amount must be a number.'),
        (0, express_validator_1.body)('dateOfExpense')
            .isISO8601()
            .toDate()
            .withMessage('Date of expense must be a valid date.'),
        (0, express_validator_1.body)('submissionDate')
            .isISO8601()
            .toDate()
            .withMessage('Submission date must be a valid date.'),
        (0, express_validator_1.body)('status')
            .notEmpty()
            .withMessage('Status is required.'),
        (0, express_validator_1.body)('notes')
            .notEmpty()
            .withMessage('Notes are required.')
    ];
};
exports.expenseValidationRules = expenseValidationRules;
const validateExpense = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateExpense = validateExpense;
