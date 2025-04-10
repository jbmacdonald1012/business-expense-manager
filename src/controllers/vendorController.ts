import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db';
import {IVendor} from "../models/Vendor";

export const getAllVendors = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const vendors = await db.collection<IVendor>('Vendors').find({}).toArray();
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendors', error });
    }
};
export const getVendorById = async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    try {
        const db = getDb();
        const vendor = await db.collection<IVendor>('Vendors').findOne({ _id: new ObjectId(vendorId) });
        if (vendor) {
            res.status(200).json(vendor);
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendor', error });
    }
};
export const createVendor = async (req: Request, res: Response) => {
    try {
        const { companyName, products, email, phoneNumber, contactPerson } = req.body;
        const newVendor: IVendor = {
            _id: null,
            companyName,
            products,
            email,
            phoneNumber,
            contactPerson
        }

        const db = getDb();
        const result = await db.collection<IVendor>('Vendors').insertOne(newVendor);
        res.status(201).json({ message: 'Vendor created successfully', vendorId: result.insertedId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating vendor', error });
    }
};
export const updateVendor = async (req: Request, res: Response) => {
    try {
        const { companyName, products, email, phoneNumber, contactPerson } = req.body;

        const updatedVendor: Partial<IVendor> = {
            companyName,
            products,
            email,
            phoneNumber,
            contactPerson
        }


        const db = getDb();

        const result = await db.collection<IVendor>('Vendors').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { companyName, products, email, phoneNumber, contactPerson } }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Vendor updated successfully' });
        } else {
            res.status(404).json({ message: 'Vendor not found or no changes made' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating vendor', error });
    }
};
export const deleteVendor = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const result = await db.collection<IVendor>('Vendors').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Vendor deleted successfully' });
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vendor', error });
    }
};