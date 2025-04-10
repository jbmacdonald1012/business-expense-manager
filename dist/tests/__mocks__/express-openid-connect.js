"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresAuth = exports.auth = void 0;
exports.auth = jest.fn().mockImplementation((config) => {
    return (req, res, next) => {
        req.oidc = {
            isAuthenticated: () => true,
            user: {
                sub: 'test|123',
                email: 'test@example.com'
            }
        };
        next();
    };
});
exports.requiresAuth = jest.fn().mockImplementation(() => {
    return (req, res, next) => next();
});
