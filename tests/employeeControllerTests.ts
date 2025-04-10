import { Request, Response } from 'express';
    import * as employeeController from '../src/controllers/employeeController';
    import { ObjectId } from 'mongodb';

    jest.mock('../src/config/db', () => {
      const fakeEmployee = {
        _id: new ObjectId("644f7a7b9f1b146d2b888888"),
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
            findOne: jest.fn(async (filter: any) => {
              return filter._id.toString() === fakeEmployee._id.toString() ? fakeEmployee : null;
            }),
            insertOne: jest.fn(async (data: any) => ({ insertedId: fakeEmployee._id })),
            updateOne: jest.fn(async (filter: any, update: any) => {
              return filter._id.toString() === fakeEmployee._id.toString() ? { modifiedCount: 1 } : { modifiedCount: 0 };
            }),
            deleteOne: jest.fn(async (filter: any) => {
              return filter._id.toString() === fakeEmployee._id.toString() ? { deletedCount: 1 } : { deletedCount: 0 };
            }),
          }))
        }))
      };
    });

    describe('Employee Controller', () => {
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

      it('getAllEmployees returns a list of employees', async () => {
        await employeeController.getAllEmployees(req as Request, res as Response);
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
        await employeeController.getEmployeeById(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe'
          })
        );
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
        await employeeController.createEmployee(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Employee created',
          employeeId: expect.any(ObjectId)
        });
      });

      it('updateEmployee updates an existing employee', async () => {
        req.params = { id: "644f7a7b9f1b146d2b888888" };
        req.body = { position: 'Senior Developer' };
        await employeeController.updateEmployee(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Employee updated successfully'
        });
      });

      it('deleteEmployee deletes an employee', async () => {
        req.params = { id: "644f7a7b9f1b146d2b888888" };
        await employeeController.deleteEmployee(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Employee deleted successfully'
        });
      });
    });