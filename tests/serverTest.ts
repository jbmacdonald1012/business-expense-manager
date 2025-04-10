import request from 'supertest';
import app from '../src/app';

describe('Server - Basic Integration Test', () => {
  it('should respond with 404 for a non-existent route', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.status).toBe(404);
  });
});