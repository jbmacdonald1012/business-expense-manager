import { body, ValidationChain, validationResult } from 'express-validator';

export const employeeValidationRules = (): ValidationChain[] => {
    return [
        body('firstName')
            .notEmpty()
            .withMessage('First name is required.'),
        body('lastName')
            .notEmpty()
            .withMessage('Last name is required.'),
        body('email')
            .isEmail()
            .withMessage('A valid email is required.'),
        body('position')
            .notEmpty()
            .withMessage('Position is required.'),
        body('department')
            .notEmpty()
            .withMessage('Department is required.'),
        body('hireDate')
            .isISO8601()
            .toDate()
            .withMessage('Hire date must be a valid date.'),
        body('salary')
            .isNumeric()
            .withMessage('Salary must be a number.'),
        body('isActive')
            .isBoolean()
            .withMessage('isActive must be a boolean value.')
    ];
};

export const validateEmployee = (req: any, res: any, next: any): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};