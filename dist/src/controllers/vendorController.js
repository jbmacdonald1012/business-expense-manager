"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendor = exports.updateVendor = exports.createVendor = exports.getVendorById = exports.getAllVendors = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const getAllVendors = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const vendors = await db.collection('Vendors').find({}).toArray();
        res.status(200).json(vendors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching vendors', error });
    }
};
exports.getAllVendors = getAllVendors;
const getVendorById = async (req, res) => {
    const vendorId = req.params.id;
    try {
        const db = (0, db_1.getDb)();
        const vendor = await db.collection('Vendors').findOne({ _id: new mongodb_1.ObjectId(vendorId) });
        if (vendor) {
            res.status(200).json(vendor);
        }
        else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching vendor', error });
    }
};
exports.getVendorById = getVendorById;
const createVendor = async (req, res) => {
    try {
        const { companyName, products, email, phoneNumber, contactPerson } = req.body;
        const newVendor = {
            _id: null,
            companyName,
            products,
            email,
            phoneNumber,
            contactPerson
        };
        const db = (0, db_1.getDb)();
        const result = await db.collection('Vendors').insertOne(newVendor);
        res.status(201).json({ message: 'Vendor created successfully', vendorId: result.insertedId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating vendor', error });
    }
};
exports.createVendor = createVendor;
const updateVendor = async (req, res) => {
    try {
        const { companyName, products, email, phoneNumber, contactPerson } = req.body;
        const updatedVendor = {
            companyName,
            products,
            email,
            phoneNumber,
            contactPerson
        };
        const db = (0, db_1.getDb)();
        const result = await db.collection('Vendors').updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: { companyName, products, email, phoneNumber, contactPerson } });
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Vendor updated successfully' });
        }
        else {
            res.status(404).json({ message: 'Vendor not found or no changes made' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating vendor', error });
    }
};
exports.updateVendor = updateVendor;
const deleteVendor = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const result = await db.collection('Vendors').deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Vendor deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting vendor', error });
    }
};
exports.deleteVendor = deleteVendor;
