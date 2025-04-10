import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import * as expenseController from '../src/controllers/expenseController';

let req: Partial<Request>;
let res: Partial<Response>;
let next: NextFunction = jest.fn();

// Mock the DB module
jest.mock('../src/config/db', () => {
  const fakeExpense = {
    _id: new ObjectId("644f7a7b9f1b146d2b654321"),
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
        findOne: jest.fn(async (filter: any) => {
          return filter._id.toString() === fakeExpense._id.toString() ? fakeExpense : null;
        }),
        insertOne: jest.fn(async (data: any) => ({ insertedId: fakeExpense._id })),
        updateOne: jest.fn(async (filter: any, update: any) => {
          return filter._id.toString() === fakeExpense._id.toString() ? { modifiedCount: 1 } : { modifiedCount: 0 };
        }),
        deleteOne: jest.fn(async (filter: any) => {
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
    await expenseController.getAllExpenses(req as Request, res as Response);
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
    await expenseController.getExpenseById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        employeeName: 'Alice',
        vendor: 'Office Supplies Inc.'
      })
    );
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
    await expenseController.createExpense(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Expense created',
      expenseId: expect.any(ObjectId)
    });
  });

  it('updateExpense updates an existing expense', async () => {
    req.params = { id: "644f7a7b9f1b146d2b654321" };
    req.body = { status: 'Approved' };
    await expenseController.updateExpense(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Expense updated successfully'
    });
  });

  it('deleteExpense deletes the expense', async () => {
    req.params = { id: "644f7a7b9f1b146d2b654321" };
    await expenseController.deleteExpense(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Expense deleted successfully'
    });
  });
});