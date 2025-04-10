"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const expenseController = __importStar(require("../src/controllers/expenseController"));
let req;
let res;
let next = jest.fn();
// Mock the DB module
jest.mock('../src/config/db', () => {
    const fakeExpense = {
        _id: new mongodb_1.ObjectId("644f7a7b9f1b146d2b654321"),
        employeeName: 'Alice',
        vendor: 'Office Supplies Inc.',
        description: 'Printer paper',
        amount: 100,
        dateOfExpense: new Date('2023-04-01'),
        submissionDate: new Date('2023-04-02'),
        status: 'Pending',
        notes: 'Urgent',
        createdAt: new Date()
    };
    return {
        getDb: jest.fn(() => ({
            collection: jest.fn(() => ({
                find: jest.fn(() => ({ toArray: jest.fn(async () => [fakeExpense]) })),
                findOne: jest.fn(async (filter) => {
                    return filter._id.toString() === fakeExpense._id.toString() ? fakeExpense : null;
                }),
                insertOne: jest.fn(async (data) => ({ insertedId: fakeExpense._id })),
                updateOne: jest.fn(async (filter, update) => {
                    return filter._id.toString() === fakeExpense._id.toString() ? { modifiedCount: 1 } : { modifiedCount: 0 };
                }),
                deleteOne: jest.fn(async (filter) => {
                    return filter._id.toString() === fakeExpense._id.toString() ? { deletedCount: 1 } : { deletedCount: 0 };
                }),
            }))
        }))
    };
});
describe('Expense Controller', () => {
    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });
    it('getAllExpenses returns a list of expenses', async () => {
        await expenseController.getAllExpenses(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            expect.objectContaining({
                employeeName: 'Alice',
                vendor: 'Office Supplies Inc.'
            })
        ]);
    });
    it('getExpenseById returns the expense if found', async () => {
        req.params = { id: "644f7a7b9f1b146d2b654321" };
        await expenseController.getExpenseById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            employeeName: 'Alice',
            vendor: 'Office Supplies Inc.'
        }));
    });
    it('createExpense inserts a new expense and returns it', async () => {
        req.body = {
            employeeName: 'Bob',
            vendor: 'Tech Supplies',
            description: 'Laptop purchase',
            amount: 1500,
            dateOfExpense: new Date('2023-04-05'),
            submissionDate: new Date('2023-04-06'),
            status: 'Approved',
            notes: 'For new hire'
        };
        await expenseController.createExpense(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Expense created',
            expenseId: expect.any(mongodb_1.ObjectId)
        });
    });
    it('updateExpense updates an existing expense', async () => {
        req.params = { id: "644f7a7b9f1b146d2b654321" };
        req.body = { status: 'Approved' };
        await expenseController.updateExpense(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Expense updated successfully'
        });
    });
    it('deleteExpense deletes the expense', async () => {
        req.params = { id: "644f7a7b9f1b146d2b654321" };
        await expenseController.deleteExpense(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Expense deleted successfully'
        });
    });
});
