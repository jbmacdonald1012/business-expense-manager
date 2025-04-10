import { Request, Response } from 'express';
import * as inventoryController from '../src/controllers/inventoryController';
import { ObjectId } from 'mongodb';

jest.mock('../src/config/db', () => {
  const fakeInventory = {
    _id: new ObjectId("644f7a7b9f1b146d2b777777"),
    product: 'Smartphone',
    description: 'Latest model smartphone',
    pricePerUnit: 800,
    quantity: 50,
  };

  return {
    getDb: jest.fn(() => ({
      collection: jest.fn(() => ({
        find: jest.fn(() => ({ toArray: jest.fn(async () => [fakeInventory]) })),
        findOne: jest.fn(async (filter: any) => {
          return filter._id.toString() === fakeInventory._id.toString() ? fakeInventory : null;
        }),
        insertOne: jest.fn(async (data: any) => ({ insertedId: fakeInventory._id })),
        updateOne: jest.fn(async (filter: any, update: any) => {
          return filter._id.toString() === fakeInventory._id.toString() ? { modifiedCount: 1 } : { modifiedCount: 0 };
        }),
        deleteOne: jest.fn(async (filter: any) => {
          return filter._id.toString() === fakeInventory._id.toString() ? { deletedCount: 1 } : { deletedCount: 0 };
        }),
      }))
    }))
  };
});

describe('Inventory Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  it('getAllInventory returns a list of inventory items', async () => {
    await inventoryController.getAllInventory(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([expect.objectContaining({
      product: 'Smartphone',
      description: 'Latest model smartphone'
    })]);
  });

  it('createInventory inserts a new inventory item and returns it', async () => {
    req.body = {
      product: 'Tablet',
      description: 'High resolution tablet',
      pricePerUnit: 600,
      quantity: 30,
    };
    await inventoryController.createInventory(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Product created',
      productId: expect.any(ObjectId)
    });
  });

  it('updateInventory updates an existing inventory item', async () => {
    req.params = { id: "644f7a7b9f1b146d2b777777" };
    req.body = { quantity: 45 };
    await inventoryController.updateInventory(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Product updated successfully'
    });
  });

  it('deleteInventory deletes the inventory item', async () => {
    req.params = { id: "644f7a7b9f1b146d2b777777" };
    await inventoryController.deleteInventory(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Product deleted successfully'
    });
  });
});