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
describe('Inventory API Routes', () => {
    let inventoryId;
    it('should create a new inventory item', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/inventory')
            .send({
            product: 'Laptop',
            description: '15-inch display laptop',
            pricePerUnit: 1200,
            quantity: 10
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        inventoryId = res.body._id;
    });
    it('should fetch all inventory items', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/inventory');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('should fetch an inventory item by ID', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get(`/api/inventory/${inventoryId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(inventoryId);
    });
    it('should update an inventory item', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/inventory/${inventoryId}`)
            .send({
            quantity: 12
        });
        expect(res.status).toBe(200);
        expect(res.body.quantity).toBe(12);
    });
    it('should delete an inventory item', async () => {
        const res = await (0, supertest_1.default)(app_1.default).delete(`/api/inventory/${inventoryId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Product deleted successfully.');
    });
});
