import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../Helpers/database';

const collectionName = "sets"

interface SetResult {
    status: number;
    set?: PracticeSet;
    sets?: PracticeSet[];
}
// GET api/set/:userId
const getSets = (req: Request, res: Response<PracticeSet[]>) => {
    const ownerId = req.params.userId;
    if (!ownerId) {
        res.status(400).send();
        return;
    }
    fetchSets(ownerId).then( result => {
        res.status(result.status).send(result.sets);
    })
}

// GET api/set/:userId/:id
const getSet = (req: Request, res: Response<PracticeSet>) => {
    const id = req.params.id;
    const ownerId = req.params.userId;
    if (!id || !ownerId) {
        res.status(400).send();
        return;
    }
    fetchSet(id,ownerId).then( result => {
        res.status(result.status).send(result.set);
    })
}

// POST api/set
const postSet = (req: Request, res: Response) => {
    const set: PracticeSet = req.body;
    addSet(set).then( result => {
        if (result.status !== 201) {
            res.status(result.status).send();
            return;
        }
        res.status(result.status).send(result.set);
    })
}

// PUT api/set/:userId/:id
const putSet = (req: Request, res: Response) => {
    const setId = req.params.id;
    const ownerId= req.params.userId;
    const item = req.body;
    if (!setId || !ownerId) {
        res.status(400).send();
        return;
    }
    updateSet(setId, ownerId, item).then( result => {
        res.status(result.status).send(result.set);
    })
}

// DELETE api/set/:id
const deleteSet = (req: Request, res: Response) => {
    const id: string = req.params.id;
    delSet(id).then( result => {
        res.status(result.status).send();
    })
}

// helper functions
const fetchSets = async (ownerId: string): Promise<SetResult> => {
    const collection = await getCollection<PracticeSet>(collectionName);
    const sets = await collection.find({ownerId}).toArray();
    return {
        status: 200,
        sets
    }
}

const fetchSet = async (setId: string, ownerId: string): Promise<SetResult> => {
    const collection = await getCollection<PracticeSet>(collectionName);
    const objId = new ObjectId(setId);
    const set = await collection.findOne({_id: objId, ownerId});
    if (!set) {
        return {
            status: 404
        }
    }
    return {
        status: 200,
        set,
    }
}

const addSet = async (set: PracticeSet): Promise<SetResult> => {
    const collection = await getCollection<PracticeSet>(collectionName);
    try {
        const res = await collection.insertOne(set);
        if (!res.acknowledged) {
            return {
                status: 500
            }
        }
        set._id = res.insertedId;
        return {
            status: 201,
            set
        }
    } catch {
        return {
            status: 400
        }
    }
}

const updateSet = async (setId: string, ownerId: string, updatedSet: PracticeSet): Promise<SetResult> => {
    const collection = await getCollection<PracticeSet>(collectionName);
    const originalResult = await fetchSet(setId, ownerId);
    if (!originalResult.set) {
        return {
            status: originalResult.status
        }
    }
    const originalSet = originalResult.set;
    const filter = {
        _id: new ObjectId(setId),
        ownerId
    }
    const set = {
        name: updatedSet.name? updatedSet.name : originalSet.name,
        items: updatedSet.items? updatedSet.items : originalSet.items,
        plannedTime: updatedSet.plannedTime? updatedSet.plannedTime : originalSet.plannedTime,
        ownerId: updatedSet.ownerId? updatedSet.ownerId : originalSet.ownerId
    }
    Object.keys(set).forEach(key => (set as any)[key]=== undefined ? delete (set as any)[key] : {});
    const updateData = {
        $set: set
    }
    try {
        const result = await collection.updateOne(filter, updateData);
        if (result.modifiedCount !== 1) {
            return {
                status: 404
            }
        }
        return {
            status: 204,
        }
    } catch {
        return {
            status: 400
        }
    }
}

const delSet = async (itemId: string): Promise<SetResult> => {
    const collection = await getCollection<PracticeSet>(collectionName);
    const objId = new ObjectId(itemId);
    const result = await collection.deleteOne({ _id: objId});
    if (!result.acknowledged) {
        return {
            status: 400
        }
    }
    return {
        status: result.deletedCount === 1? 204 : 404
    }
}

// Pewno da się zrobić lepiej
export const updateItemInSets = async (item: PracticeItem, ownerId: string) => {
    const collection = await getCollection<PracticeSet>(collectionName);
    const sets = await collection.find({ownerId}).toArray();

    try {
        sets.forEach(async (setItem) => {
            const newItems = setItem.items.map(i => {
                return i._id === item._id? item : i;
            })
            const filter = {
                _id: new ObjectId(setItem._id),
                ownerId
            }
            const set = {
                $set: {
                    items: newItems
                }
            }
            try {
                const result = await collection.updateOne(filter, set);
                if (result.modifiedCount !== 1) {
                    throw Error("NotModified")
                }
            } catch {
                throw Error("DbError")
            }
        })
    } catch {
        return false;
    }
    return true;
}

export const deleteItemInSets = async (itemId: string) => {
    const collection = await getCollection<PracticeSet>(collectionName);
    const sets = await collection.find().toArray();

    try {
        sets.forEach(async (setItem) => {
            const objId = new ObjectId(itemId);
            const newItems = setItem.items.filter(i => i._id.toString() !== itemId);
            const filter = {
                _id: new ObjectId(setItem._id),
            }
            const set = {
                $set: {
                    items: newItems
                }
            }
            try {
                const result = await collection.updateOne(filter, set);
                if (result.modifiedCount !== 1) {
                    throw Error("NotModified")
                }
            } catch {
                throw Error("DbError")
            }
        })
    } catch {
        return false;
    }
    return true;
}

export const setsRouter = express.Router();
setsRouter.get("/set/:userId", getSets);
setsRouter.get("/set/:userId/:id", getSet)
setsRouter.post("/set", postSet);
setsRouter.put("/set/:userId/:id", putSet);
setsRouter.delete("/set/:id", deleteSet);