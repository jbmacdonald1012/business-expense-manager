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
describe('Employee API Routes', () => {
    let employeeId;
    it('should create a new employee', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/employees')
            .send({
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice.smith@example.com',
            position: 'Developer',
            department: 'Engineering',
            hireDate: '2023-04-09',
            salary: 70000,
            isActive: true
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.firstName).toBe('Alice');
        employeeId = res.body._id;
    });
    it('should fetch all employees', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/employees');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
    it('should fetch a specific employee by ID', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get(`/api/employees/${employeeId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(employeeId);
    });
    it('should update an employee', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/employees/${employeeId}`)
            .send({
            salary: 75000
        });
        expect(res.status).toBe(200);
        expect(res.body.salary).toBe(75000);
    });
    it('should delete an employee', async () => {
        const res = await (0, supertest_1.default)(app_1.default).delete(`/api/employees/${employeeId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Employee deleted successfully.');
    });
});
