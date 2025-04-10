"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getEmployeeById = exports.getAllEmployees = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const getAllEmployees = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const employees = await db.collection('Employee').find().toArray();
        res.status(200).json(employees);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error });
    }
};
exports.getAllEmployees = getAllEmployees;
const getEmployeeById = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const employee = await db.collection('Employee').findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (!employee) {
            res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error });
    }
};
exports.getEmployeeById = getEmployeeById;
const createEmployee = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const { firstName, lastName, email, position, department, hireDate, salary, isActive } = req.body;
        const newEmployee = {
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
        const result = await db.collection('Employee').insertOne(newEmployee);
        res.status(201).json({ message: 'Employee created', employeeId: result.insertedId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating employee', error });
    }
};
exports.createEmployee = createEmployee;
const updateEmployee = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const { firstName, lastName, email, position, department, hireDate, salary, isActive } = req.body;
        const updatedEmployee = {
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
        const result = await db.collection('Employee').updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: updatedEmployee });
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: 'Employee not found or no changes made' });
        }
        res.status(200).json({ message: 'Employee updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating employee', error });
    }
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const result = await db.collection('Employee').deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
};
exports.deleteEmployee = deleteEmployee;
