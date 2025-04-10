"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = exports.createExpense = exports.getExpenseById = exports.getAllExpenses = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const getAllExpenses = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const expenses = await db.collection('Expense').find().toArray();
        res.status(200).json(expenses);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
};
exports.getAllExpenses = getAllExpenses;
const getExpenseById = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const expense = await db.collection('Expense').findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(expense);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching expense', error });
    }
};
exports.getExpenseById = getExpenseById;
const createExpense = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const { employeeName, vendor, description, amount, dateOfExpense, submissionDate, status, notes } = req.body;
        const newExpense = {
            _id: null,
            employeeName,
            vendor,
            description,
            amount,
            dateOfExpense,
            submissionDate,
            status,
            notes,
            createdAt: new Date()
        };
        const result = await db.collection('Expense').insertOne(newExpense);
        res.status(201).json({ message: 'Expense created', expenseId: result.insertedId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating expense', error });
    }
};
exports.createExpense = createExpense;
const updateExpense = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const { employeeName, vendor, description, amount, dateOfExpense, submissionDate, status, notes } = req.body;
        const updatedExpense = {
            employeeName,
            vendor,
            description,
            amount,
            dateOfExpense,
            submissionDate,
            status,
            notes
        };
        const result = await db.collection('Expense').updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: updatedExpense });
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: 'Expense not found or no changes made' });
        }
        res.status(200).json({ message: 'Expense updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating expense', error });
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const result = await db.collection('Expense').deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error });
    }
};
exports.deleteExpense = deleteExpense;
