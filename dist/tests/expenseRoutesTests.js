"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const db_1 = require("../src/config/db");
let database;
let db;
beforeAll(async () => {
    database = await (0, db_1.connectToDatabase)();
    db = database.db('business-expense-manager-dev');
    await db.collection('employees').deleteMany({});
});
afterAll(async () => {
    await (0, db_1.closeDatabaseConnection)();
});
describe('Expense API Routes', () => {
    let expenseId;
    it('should create a new expense', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/expenses')
            .send({
            employeeName: 'Bob',
            vendor: 'Office Supplies Co.',
            description: 'Printer ink cartridges',
            amount: 150,
            dateOfExpense: '2023-04-08',
            submissionDate: '2023-04-09',
            status: 'Pending',
            notes: 'Order urgently'
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expenseId = res.body._id;
    });
    it('should fetch all expenses', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/expenses');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('should fetch an expense by ID', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get(`/api/expenses/${expenseId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(expenseId);
    });
    it('should update an expense', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/expenses/${expenseId}`)
            .send({
            status: 'Approved'
        });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('Approved');
    });
    it('should delete an expense', async () => {
        const res = await (0, supertest_1.default)(app_1.default).delete(`/api/expenses/${expenseId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Expense deleted successfully.');
    });
});
