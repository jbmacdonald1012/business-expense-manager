import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';
import {IInventory} from "../models/Inventory";


export const getAllInventory = async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const inventoryCollection = db.collection('Inventory');
        const inventoryItems = await inventoryCollection.find({}).toArray();
        res.status(200).json(inventoryItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory', error });
    }
};
export const getInventoryById = async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const inventoryCollection = db.collection('Inventory');
        const inventoryItem = await inventoryCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!inventoryItem) {
            res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json(inventoryItem);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory item', error });
    }
};
export const createInventory = async (req: Request, res: Response) => {
    try{
        const db = await connectToDatabase();
        const { product, description, pricePerUnit, quantity } = req.body;

        const newInventoryItem: IInventory = {
           _id: null,
            product,
            description,
            pricePerUnit,
            quantity
        };

        const result = await db.collection<IInventory>('Inventory').insertOne(newInventoryItem);
        res.status(201).json({ message: 'Inventory item created', inventoryId: result.insertedId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating inventory item', error });
    }
};
export const updateInventory = async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const { product, description, pricePerUnit, quantity } = req.body;

        const updatedInventoryItem: Partial<IInventory> = {
            product,
            description,
            pricePerUnit,
            quantity
        };

        const result = await db.collection<IInventory>('Inventory').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedInventoryItem }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(204).json({ message: 'Inventory item updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating inventory item', error });
    }
};
export const deleteInventory = async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const result = await db.collection<IInventory>('Inventory').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(204).json({ message: 'Inventory item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting inventory item', error });
    }
};
