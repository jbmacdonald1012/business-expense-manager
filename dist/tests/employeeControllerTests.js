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
const employeeController = __importStar(require("../src/controllers/employeeController"));
const mongodb_1 = require("mongodb");
jest.mock('../src/config/db', () => {
    const fakeEmployee = {
        _id: new mongodb_1.ObjectId("644f7a7b9f1b146d2b888888"),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        department: 'IT',
        position: 'Developer',
        hireDate: new Date('2023-01-01'),
        salary: 75000
    };
    return {
        getDb: jest.fn(() => ({
            collection: jest.fn(() => ({
                find: jest.fn(() => ({ toArray: jest.fn(async () => [fakeEmployee]) })),
                findOne: jest.fn(async (filter) => {
                    return filter._id.toString() === fakeEmployee._id.toString() ? fakeEmployee : null;
                }),
                insertOne: jest.fn(async (data) => ({ insertedId: fakeEmployee._id })),
                updateOne: jest.fn(async (filter, update) => {
                    return filter._id.toString() === fakeEmployee._id.toString() ? { modifiedCount: 1 } : { modifiedCount: 0 };
                }),
                deleteOne: jest.fn(async (filter) => {
                    return filter._id.toString() === fakeEmployee._id.toString() ? { deletedCount: 1 } : { deletedCount: 0 };
                }),
            }))
        }))
    };
});
describe('Employee Controller', () => {
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
    it('getAllEmployees returns a list of employees', async () => {
        await employeeController.getAllEmployees(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                firstName: 'John',
                lastName: 'Doe'
            })
        ]));
    });
    it('getEmployeeById returns the employee if found', async () => {
        req.params = { id: "644f7a7b9f1b146d2b888888" };
        await employeeController.getEmployeeById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe'
        }));
    });
    it('createEmployee creates a new employee', async () => {
        req.body = {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            department: 'HR',
            position: 'Manager',
            hireDate: new Date('2023-02-01'),
            salary: 85000
        };
        await employeeController.createEmployee(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Employee created',
            employeeId: expect.any(mongodb_1.ObjectId)
        });
    });
    it('updateEmployee updates an existing employee', async () => {
        req.params = { id: "644f7a7b9f1b146d2b888888" };
        req.body = { position: 'Senior Developer' };
        await employeeController.updateEmployee(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Employee updated successfully'
        });
    });
    it('deleteEmployee deletes an employee', async () => {
        req.params = { id: "644f7a7b9f1b146d2b888888" };
        await employeeController.deleteEmployee(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Employee deleted successfully'
        });
    });
});
