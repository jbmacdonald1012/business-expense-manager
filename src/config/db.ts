import dotenv from 'dotenv';
dotenv.config();

import { MongoClient, Db } from 'mongodb';

let database: Db;

export async function connectToDatabase(): Promise<Db> {
    if (database) {
        return database;
    }

    try {
        const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING || '')
        await client.connect();

        database = client.db(process.env.MONGO_DB_NAME || '');

        console.log('Successfully connected to the Database');

        return database;
    }
    catch (error) {
        console.error('Error connecting to the Database', error);
        throw error;
    }
}