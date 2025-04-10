import request from 'supertest';
import app from '../src/app';
import { connectToDatabase, closeDatabaseConnection } from '../src/config/db';
import { MongoClient, Db } from 'mongodb';

let database: MongoClient;
let db: Db;

beforeAll(async () => {
  database = await connectToDatabase();
  db = database.db('business-expense-manager-dev');
  await db.collection('employees').deleteMany({});
});

afterAll(async () => {
  await closeDatabaseConnection();
});

describe('Inventory API Routes', () => {
  let inventoryId: string;

  it('should create a new inventory item', async () => {
    const res = await request(app)
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
    const res = await request(app).get('/api/inventory');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch an inventory item by ID', async () => {
    const res = await request(app).get(`/api/inventory/${inventoryId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(inventoryId);
  });

  it('should update an inventory item', async () => {
    const res = await request(app)
      .put(`/api/inventory/${inventoryId}`)
      .send({
        quantity: 12
      });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(12);
  });

  it('should delete an inventory item', async () => {
    const res = await request(app).delete(`/api/inventory/${inventoryId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully.');
  });
});
