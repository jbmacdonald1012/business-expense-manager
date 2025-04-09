import { body, ValidationChain, validationResult } from 'express-validator';

export const expenseValidationRules = (): ValidationChain[] => {
    return [
        body('employeeName')
            .notEmpty()
            .withMessage('Employee name is required.'),
        body('vendor')
            .notEmpty()
            .withMessage('Vendor is required.'),
        body('description')
            .notEmpty()
            .withMessage('Description is required.'),
        body('amount')
            .isNumeric()
            .withMessage('Amount must be a number.'),
        body('dateOfExpense')
            .isISO8601()
            .toDate()
            .withMessage('Date of expense must be a valid date.'),
        body('submissionDate')
            .isISO8601()
            .toDate()
            .withMessage('Submission date must be a valid date.'),
        body('status')
            .notEmpty()
            .withMessage('Status is required.'),
        body('notes')
            .notEmpty()
            .withMessage('Notes are required.')
    ];
};

export const validateExpense = (req: any, res: any, next: any): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};