import { Request, Response } from 'express';
import * as vendorController from '../src/controllers/vendorController';
import { ObjectId } from 'mongodb';

jest.mock('../src/config/db', () => {
  const fakeVendor = {
    _id: new ObjectId("644f7a7b9f1b146d2b999999"),
    name: 'Tech Supplies Inc',
    contactPerson: 'Jane Smith',
    email: 'jane@techsupplies.com',
    phone: '555-0123',
    address: '123 Tech St'
  };

  return {
    getDb: jest.fn(() => ({
      collection: jest.fn(() => ({
        find: jest.fn(() => ({ toArray: jest.fn(async () => [fakeVendor]) })),
        findOne: jest.fn(async (filter: any) => {
          return filter._id.toString() === fakeVendor._id.toString() ? fakeVendor : null;
        }),
        insertOne: jest.fn(async (data: any) => ({ insertedId: fakeVendor._id })),
        updateOne: jest.fn(async (filter: any, update: any) => {
          return filter._id.toString() === fakeVendor._id.toString() ? { modifiedCount: 1 } : { modifiedCount: 0 };
        }),
        deleteOne: jest.fn(async (filter: any) => {
          return filter._id.toString() === fakeVendor._id.toString() ? { deletedCount: 1 } : { deletedCount: 0 };
        }),
      }))
    }))
  };
});

describe('Vendor Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('getAllVendors returns a list of vendors', async () => {
    await vendorController.getAllVendors(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        name: 'Tech Supplies Inc',
        email: 'jane@techsupplies.com'
      })
    ]);
  });

  it('getVendorById returns the vendor if found', async () => {
    req.params = { id: "644f7a7b9f1b146d2b999999" };
    await vendorController.getVendorById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Tech Supplies Inc',
        email: 'jane@techsupplies.com'
      })
    );
  });

  it('createVendor creates a new vendor', async () => {
    req.body = {
      name: 'Office Supplies Co',
      contactPerson: 'John Doe',
      email: 'john@officesupplies.com',
      phone: '555-0124',
      address: '456 Office St'
    };
    await vendorController.createVendor(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Vendor created',
      vendorId: expect.any(ObjectId)
    });
  });

  it('updateVendor updates an existing vendor', async () => {
    req.params = { id: "644f7a7b9f1b146d2b999999" };
    req.body = { phone: '555-9999' };
    await vendorController.updateVendor(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Vendor updated successfully'
    });
  });

  it('deleteVendor deletes a vendor', async () => {
    req.params = { id: "644f7a7b9f1b146d2b999999" };
    await vendorController.deleteVendor(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Vendor deleted successfully'
    });
  });
});