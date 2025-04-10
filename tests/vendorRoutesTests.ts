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


describe('Vendor API Routes', () => {
  let vendorId: string;

  it('should create a new vendor', async () => {
    const res = await request(app)
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
    const res = await request(app).get('/api/vendors');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a vendor by ID', async () => {
    const res = await request(app).get(`/api/vendors/${vendorId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(vendorId);
  });

  it('should update a vendor', async () => {
    const res = await request(app)
      .put(`/api/vendors/${vendorId}`)
      .send({
        contactPerson: 'John Doe'
      });
    expect(res.status).toBe(200);
    expect(res.body.contactPerson).toBe('John Doe');
  });

  it('should delete a vendor', async () => {
    const res = await request(app).delete(`/api/vendors/${vendorId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Vendor deleted successfully.');
  });
});
