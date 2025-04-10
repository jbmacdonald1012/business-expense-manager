import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';

dotenv.config();

let database: Db | null = null;
let client: MongoClient | null = null;

export async function connectToDatabase(): Promise<MongoClient> {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const dbName = process.env.MONGO_DB_NAME;

    if (!connectionString || !dbName) {
        throw new Error('Missing required MongoDB environment variables');
    }

    if (client && database) {
        return client;
    }

    try {
        client = new MongoClient(connectionString);
        await client.connect();
        database = client.db(dbName);
        return client;
    } catch (error) {
        console.error('Error connecting to the Database:', error);
        throw error;
    }
}

export function getDb(): Db {
    if (!database) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return database;
}

export async function closeDatabaseConnection(): Promise<void> {
    try {
        if (client) {
            await client.close();
            console.log('Database connection closed');
            database = null;
            client = null;
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
    }
}