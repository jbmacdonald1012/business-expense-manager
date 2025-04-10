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
describe('Vendor API Routes', () => {
    let vendorId;
    it('should create a new vendor', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/vendors')
            .send({
            companyName: 'SupplyCo',
            products: ['Office supplies', 'Furniture'],
            email: 'contact@supplyco.com',
            phoneNumber: '123-456-7890',
            contactPerson: 'Jane Doe'
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        vendorId = res.body._id;
    });
    it('should fetch all vendors', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/vendors');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('should fetch a vendor by ID', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get(`/api/vendors/${vendorId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(vendorId);
    });
    it('should update a vendor', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/vendors/${vendorId}`)
            .send({
            contactPerson: 'John Doe'
        });
        expect(res.status).toBe(200);
        expect(res.body.contactPerson).toBe('John Doe');
    });
    it('should delete a vendor', async () => {
        const res = await (0, supertest_1.default)(app_1.default).delete(`/api/vendors/${vendorId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Vendor deleted successfully.');
    });
});
