"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventory = exports.updateInventory = exports.createInventory = exports.getInventoryById = exports.getAllInventory = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const getAllInventory = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const inventoryCollection = db.collection('Inventory');
        const inventoryItems = await inventoryCollection.find({}).toArray();
        res.status(200).json(inventoryItems);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching inventory', error });
    }
};
exports.getAllInventory = getAllInventory;
const getInventoryById = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const inventoryCollection = db.collection('Inventory');
        const inventoryItem = await inventoryCollection.findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (!inventoryItem) {
            res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json(inventoryItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching inventory item', error });
    }
};
exports.getInventoryById = getInventoryById;
const createInventory = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const { product, description, pricePerUnit, quantity } = req.body;
        const newInventoryItem = {
            _id: null,
            product,
            description,
            pricePerUnit,
            quantity
        };
        const result = await db.collection('Inventory').insertOne(newInventoryItem);
        res.status(201).json({ message: 'Inventory item created', inventoryId: result.insertedId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating inventory item', error });
    }
};
exports.createInventory = createInventory;
const updateInventory = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const { product, description, pricePerUnit, quantity } = req.body;
        const updatedInventoryItem = {
            product,
            description,
            pricePerUnit,
            quantity
        };
        const result = await db.collection('Inventory').updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: updatedInventoryItem });
        if (result.matchedCount === 0) {
            res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(204).json({ message: 'Inventory item updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating inventory item', error });
    }
};
exports.updateInventory = updateInventory;
const deleteInventory = async (req, res) => {
    try {
        const db = (0, db_1.getDb)();
        const result = await db.collection('Inventory').deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(204).json({ message: 'Inventory item deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting inventory item', error });
    }
};
exports.deleteInventory = deleteInventory;
