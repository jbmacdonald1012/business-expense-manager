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

describe('Employee API Routes', () => {
  let employeeId: string;

  it('should create a new employee', async () => {
    const res = await request(app)
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
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should fetch a specific employee by ID', async () => {
    const res = await request(app).get(`/api/employees/${employeeId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(employeeId);
  });

  it('should update an employee', async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .send({
        salary: 75000
      });
    expect(res.status).toBe(200);
    expect(res.body.salary).toBe(75000);
  });

  it('should delete an employee', async () => {
    const res = await request(app).delete(`/api/employees/${employeeId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Employee deleted successfully.');
  });
});
