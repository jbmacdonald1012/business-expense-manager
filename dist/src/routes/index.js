"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employeeRoutes_1 = __importDefault(require("./employeeRoutes"));
const expenseRoutes_1 = __importDefault(require("./expenseRoutes"));
const inventoryRoutes_1 = __importDefault(require("./inventoryRoutes"));
const vendorRoutes_1 = __importDefault(require("./vendorRoutes"));
const router = (0, express_1.Router)();
router.use('/employees', employeeRoutes_1.default);
router.use('/expenses', expenseRoutes_1.default);
router.use('/inventory', inventoryRoutes_1.default);
router.use('/vendors', vendorRoutes_1.default);
exports.default = router;
