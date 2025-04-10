"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmployee = exports.employeeValidationRules = void 0;
const express_validator_1 = require("express-validator");
const employeeValidationRules = () => {
    return [
        (0, express_validator_1.body)('firstName')
            .notEmpty()
            .withMessage('First name is required.'),
        (0, express_validator_1.body)('lastName')
            .notEmpty()
            .withMessage('Last name is required.'),
        (0, express_validator_1.body)('email')
            .isEmail()
            .withMessage('A valid email is required.'),
        (0, express_validator_1.body)('position')
            .notEmpty()
            .withMessage('Position is required.'),
        (0, express_validator_1.body)('department')
            .notEmpty()
            .withMessage('Department is required.'),
        (0, express_validator_1.body)('hireDate')
            .isISO8601()
            .toDate()
            .withMessage('Hire date must be a valid date.'),
        (0, express_validator_1.body)('salary')
            .isNumeric()
            .withMessage('Salary must be a number.'),
        (0, express_validator_1.body)('isActive')
            .isBoolean()
            .withMessage('isActive must be a boolean value.')
    ];
};
exports.employeeValidationRules = employeeValidationRules;
const validateEmployee = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateEmployee = validateEmployee;
