import { body, ValidationChain, validationResult } from 'express-validator';

export const vendorValidationRules = (): ValidationChain[] => {
    return [
        body('companyName')
            .notEmpty()
            .withMessage('Company name is required.'),
        body('products')
            .isArray()
            .withMessage('Products must be an array.'),
        body('products.*')
            .isString()
            .withMessage('Each product in the array must be a string.'),
        body('email')
            .isEmail()
            .withMessage('A valid email is required.'),
        body('phoneNumber')
            .notEmpty()
            .withMessage('Phone number is required.'),
        body('contactPerson')
            .notEmpty()
            .withMessage('Contact person is required.')
    ];
};

export const validateVendor = (req: any, res: any, next: any): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};