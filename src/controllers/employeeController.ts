import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ObjectId } from 'mongodb';
import {  getDb } from '../config/db';
import {IEmployee} from "../models/Employee";


export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const employees = await db.collection<IEmployee>('Employee').find().toArray();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error });
    }
};
export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const employee = await db.collection<IEmployee>('Employee').findOne({ _id: new ObjectId(req.params.id) });
        if (!employee) {
            res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error });
    }
};
export const createEmployee = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const { firstName, lastName, email, position, department, hireDate, salary, isActive } = req.body;

        const newEmployee: IEmployee = {
            _id: null,
            firstName,
            lastName,
            email,
            position,
            department,
            hireDate,
            salary,
            isActive,
            createdAt: new Date()
        };

        const result = await db.collection<IEmployee>('Employee').insertOne(newEmployee);
        res.status(201).json({ message: 'Employee created', employeeId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error });
    }
};
export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const { firstName, lastName, email, position, department, hireDate, salary, isActive } = req.body;

        const updatedEmployee: Partial<IEmployee> = {
            _id: null,
            firstName,
            lastName,
            email,
            position,
            department,
            hireDate,
            salary,
            isActive
        };

        const result = await db.collection<IEmployee>('Employee').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedEmployee }
        );

        if (result.modifiedCount === 0) {
            res.status(404).json({ message: 'Employee not found or no changes made' });
        }

        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error });
    }
};
export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const result = await db.collection<IEmployee>('Employee').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
             res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
};