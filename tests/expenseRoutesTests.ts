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

describe('Expense API Routes', () => {
  let expenseId: string;

  it('should create a new expense', async () => {
    const res = await request(app)
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
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch an expense by ID', async () => {
    const res = await request(app).get(`/api/expenses/${expenseId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(expenseId);
  });

  it('should update an expense', async () => {
    const res = await request(app)
      .put(`/api/expenses/${expenseId}`)
      .send({
        status: 'Approved'
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Approved');
  });

  it('should delete an expense', async () => {
    const res = await request(app).delete(`/api/expenses/${expenseId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Expense deleted successfully.');
  });
});
