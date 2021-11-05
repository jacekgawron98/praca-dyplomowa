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
    addItemsValidation(db);
    addSetsValidation(db);
    database = db
    console.log(`[log] Connected to the database ${config.database_name}`)
}

export const getCollection = async <T>(collection: string) => {
    return database.collection<T>(collection);
}

const addItemsValidation = async (db: mongodb.Db) => {
    db.createCollection("items", {}, async (error,collection) => {
        if (error) {
            console.log(`[log]: ${error.message}`);
            return;
        }
        await db.command({
            "collMod": "items",
            "validator": {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["name", "ownerId"],
                    additionalProperties: false,
                    properties: {
                        _id: {},
                        name: {
                            bsonType: "string"
                        },
                        description:{
                            bsonType: "string"
                        },
                        duration: {
                            bsonType: "number"
                        },
                        repeats: {
                            bsonType: "number"
                        },
                        statisticName: {
                            bsonType: "string"
                        },
                        videoLink: {
                            bsonType: "string"
                        },
                        tags: {
                            bsonType: "array",
                            items: {
                                bsonType: "string"
                            }
                        },
                        ownerId: {
                            bsonType: "string"
                        },
                    }
                }
            }
        })
    })
}

const addSetsValidation = async (db: mongodb.Db) => {
    db.createCollection("sets", {}, async (error,collection) => {
        if (error) {
            console.log(`[log]: ${error.message}`);
            return;
        }
        await db.command({
            "collMod": "sets",
            "validator": {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["name", "ownerId", "items"],
                    additionalProperties: false,
                    properties: {
                        _id: {},
                        name: {
                            bsonType: "string"
                        },
                        items:{
                            bsonType: "array",
                            items: {
                                bsonType: "object",
                                required: ["name", "ownerId"],
                                additionalProperties: false,
                                properties: {
                                    _id: {},
                                    name: {
                                        bsonType: "string"
                                    },
                                    description:{
                                        bsonType: "string"
                                    },
                                    duration: {
                                        bsonType: "number"
                                    },
                                    repeats: {
                                        bsonType: "number"
                                    },
                                    statisticName: {
                                        bsonType: "string"
                                    },
                                    videoLink: {
                                        bsonType: "string"
                                    },
                                    tags: {
                                        bsonType: "array",
                                        items: {
                                            bsonType: "string"
                                        }
                                    },
                                    ownerId: {
                                        bsonType: "string"
                                    },
                                }
                            }
                        },
                        plannedTime: {
                            bsonType: "object",
                            properties: {
                                day: {
                                    bsonType: "string"
                                },
                                hour: {
                                    bsonType: "number"
                                },
                                minute: {
                                    bsonType: "number"
                                },
                                isWeekly: {
                                    bsonType: "bool"
                                }
                            }
                        },
                        ownerId: {
                            bsonType: "string"
                        },
                    }
                }
            }
        })
    })
}