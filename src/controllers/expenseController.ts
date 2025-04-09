import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';
import {IExpense} from "../models/Expense";

export const getAllExpenses = async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const expenses = await db.collection<IExpense>('Expense').find().toArray();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
};
export const getExpenseById = async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const expense = await db.collection<IExpense>('Expense').findOne({ _id: new ObjectId(req.params.id) });
        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense', error });
    }
};
export const createExpense = async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const { employeeName, vendor, description, amount, dateOfExpense, submissionDate, status, notes} = req.body;

        const newExpense: IExpense = {
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
        }

        const result = await db.collection<IExpense>('Expense').insertOne(newExpense);
        res.status(201).json({ message: 'Expense created', expenseId: result.insertedId });
    } catch (error) {
        res.status(500).json({message: 'Error creating expense', error});
    }
};
export const updateExpense = async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const { employeeName, vendor, description, amount, dateOfExpense, submissionDate, status, notes } = req.body;

        const updatedExpense: Partial<IExpense> = {
            employeeName,
            vendor,
            description,
            amount,
            dateOfExpense,
            submissionDate,
            status,
            notes
        };

        const result = await db.collection<IExpense>('Expense').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedExpense }
        );

        if (result.modifiedCount === 0) {
            res.status(404).json({ message: 'Expense not found or no changes made' });
        }

        res.status(200).json({ message: 'Expense updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating expense', error });
    }
};
export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const result = await db.collection<IExpense>('Expense').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error });
    }
};
