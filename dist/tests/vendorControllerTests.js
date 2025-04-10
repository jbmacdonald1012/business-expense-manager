"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vendorController = __importStar(require("../src/controllers/vendorController"));
const mongodb_1 = require("mongodb");
jest.mock('../src/config/db', () => {
    const fakeVendor = {
        _id: new mongodb_1.ObjectId("644f7a7b9f1b146d2b999999"),
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
                findOne: jest.fn(async (filter) => {
                    return filter._id.toString() === fakeVendor._id.toString() ? fakeVendor : null;
                }),
                insertOne: jest.fn(async (data) => ({ insertedId: fakeVendor._id })),
                updateOne: jest.fn(async (filter, update) => {
                    return filter._id.toString() === fakeVendor._id.toString() ? { modifiedCount: 1 } : { modifiedCount: 0 };
                }),
                deleteOne: jest.fn(async (filter) => {
                    return filter._id.toString() === fakeVendor._id.toString() ? { deletedCount: 1 } : { deletedCount: 0 };
                }),
            }))
        }))
    };
});
describe('Vendor Controller', () => {
    let req;
    let res;
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
        await vendorController.getAllVendors(req, res);
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
        await vendorController.getVendorById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Tech Supplies Inc',
            email: 'jane@techsupplies.com'
        }));
    });
    it('createVendor creates a new vendor', async () => {
        req.body = {
            name: 'Office Supplies Co',
            contactPerson: 'John Doe',
            email: 'john@officesupplies.com',
            phone: '555-0124',
            address: '456 Office St'
        };
        await vendorController.createVendor(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Vendor created',
            vendorId: expect.any(mongodb_1.ObjectId)
        });
    });
    it('updateVendor updates an existing vendor', async () => {
        req.params = { id: "644f7a7b9f1b146d2b999999" };
        req.body = { phone: '555-9999' };
        await vendorController.updateVendor(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Vendor updated successfully'
        });
    });
    it('deleteVendor deletes a vendor', async () => {
        req.params = { id: "644f7a7b9f1b146d2b999999" };
        await vendorController.deleteVendor(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Vendor deleted successfully'
        });
    });
});
