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
const inventoryController = __importStar(require("../src/controllers/inventoryController"));
const mongodb_1 = require("mongodb");
jest.mock('../src/config/db', () => {
    const fakeInventory = {
        _id: new mongodb_1.ObjectId("644f7a7b9f1b146d2b777777"),
        product: 'Smartphone',
        description: 'Latest model smartphone',
        pricePerUnit: 800,
        quantity: 50,
    };
    return {
        getDb: jest.fn(() => ({
            collection: jest.fn(() => ({
                find: jest.fn(() => ({ toArray: jest.fn(async () => [fakeInventory]) })),
                findOne: jest.fn(async (filter) => {
                    return filter._id.toString() === fakeInventory._id.toString() ? fakeInventory : null;
                }),
                insertOne: jest.fn(async (data) => ({ insertedId: fakeInventory._id })),
                updateOne: jest.fn(async (filter, update) => {
                    return filter._id.toString() === fakeInventory._id.toString() ? { modifiedCount: 1 } : { modifiedCount: 0 };
                }),
                deleteOne: jest.fn(async (filter) => {
                    return filter._id.toString() === fakeInventory._id.toString() ? { deletedCount: 1 } : { deletedCount: 0 };
                }),
            }))
        }))
    };
});
describe('Inventory Controller', () => {
    let req;
    let res;
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
        await inventoryController.getAllInventory(req, res);
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
        await inventoryController.createInventory(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Product created',
            productId: expect.any(mongodb_1.ObjectId)
        });
    });
    it('updateInventory updates an existing inventory item', async () => {
        req.params = { id: "644f7a7b9f1b146d2b777777" };
        req.body = { quantity: 45 };
        await inventoryController.updateInventory(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Product updated successfully'
        });
    });
    it('deleteInventory deletes the inventory item', async () => {
        req.params = { id: "644f7a7b9f1b146d2b777777" };
        await inventoryController.deleteInventory(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Product deleted successfully'
        });
    });
});
