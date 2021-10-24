import * as mongodb from 'mongodb';
import config from '../config.js';
const { MongoClient } = mongodb;

const uri = config.database_uri;

export let database: mongodb.Db

export const connectToDatabase = async () => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
    } catch {
        console.log("[error] Database connection error");
    }
    const db = client.db(config.database_name);
    database = db
    console.log(`[log] Connected to the database ${config.database_name}`)
}

export const getCollection = async <T>(collection: string) => {
    return database.collection<T>(collection);
}