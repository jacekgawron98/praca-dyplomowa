import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../Helpers/database';

const collectionName = "history"

interface SetResult {
    status: number;
    singleHistory?: History;
    history?: History[];
}
// GET api/history/:userId
const getHistory = (req: Request, res: Response<History[]>) => {
    const ownerId = req.params.userId;
    if (!ownerId) {
        res.status(400).send();
        return;
    }
    fetchHistory(ownerId).then( result => {
        res.status(result.status).send(result.history);
    })
}

// POST api/history
const postHistory = (req: Request, res: Response) => {
    const history: History = req.body;
    addHistory(history).then( result => {
        if (result.status !== 201) {
            res.status(result.status).send();
            return;
        }
        res.status(result.status).send(result.singleHistory);
    })
}

const fetchHistory = async (ownerId: string): Promise<SetResult> => {
    const collection = await getCollection<History>(collectionName);
    const history = await collection.find({ownerId}).toArray();
    return {
        status: 200,
        history
    }
}

const addHistory = async (history: History): Promise<SetResult> => {
    const collection = await getCollection<History>(collectionName);
    try {
        const res = await collection.insertOne(history);
        if (!res.acknowledged) {
            return {
                status: 500
            }
        }
        history._id = res.insertedId;
        return {
            status: 201,
            singleHistory: history
        }
    } catch {
        return {
            status: 400
        }
    }
}

export const historyRouter = express.Router();
historyRouter.get("/history/:userId",getHistory);
historyRouter.post("/set", postHistory);