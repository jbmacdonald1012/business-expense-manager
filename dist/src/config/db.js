"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.getDb = getDb;
exports.closeDatabaseConnection = closeDatabaseConnection;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
let database = null;
let client = null;
async function connectToDatabase() {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const dbName = process.env.MONGO_DB_NAME;
    if (!connectionString || !dbName) {
        throw new Error('Missing required MongoDB environment variables');
    }
    if (client && database) {
        return client;
    }
    try {
        client = new mongodb_1.MongoClient(connectionString);
        await client.connect();
        database = client.db(dbName);
        return client;
    }
    catch (error) {
        console.error('Error connecting to the Database:', error);
        throw error;
    }
}
function getDb() {
    if (!database) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return database;
}
async function closeDatabaseConnection() {
    try {
        if (client) {
            await client.close();
            console.log('Database connection closed');
            database = null;
            client = null;
        }
    }
    catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
    }
}
