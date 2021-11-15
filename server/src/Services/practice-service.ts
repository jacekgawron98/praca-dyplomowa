import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection, getCommandResult } from '../Helpers/database';
import { deleteItemInSets, updateItemInSets } from './sets-service';

const collectionName = "items"

interface ItemResult {
    status: number;
    item?: PracticeItem;
    items?: PracticeItem[];
    tags?: string[]
}

const getItemsTags = (req: Request, res: Response<string[]>) => {
    const ownerId = req.params.userId;
    if (!ownerId) {
        res.status(400).send();
        return;
    }
    fetchTags(ownerId).then( result => {
        res.status(result.status).send(result.tags);
    }).catch( err => {
        console.log(err);
    })
}

// GET api/item/:userId
const getItems = (req: Request, res: Response<PracticeItem[]>) => {
    const ownerId = req.params.userId;
    if (!ownerId) {
        res.status(400).send();
        return;
    }
    fetchItems(ownerId, req.query.stats? true : false).then( result => {
        res.status(result.status).send(result.items);
    })
}

// GET api/item/:userId/:id
const getItem = (req: Request, res: Response<PracticeItem>) => {
    const id = req.params.id;
    const ownerId = req.params.userId;
    if (!id || !ownerId) {
        res.status(400).send();
        return;
    }
    fetchItem(id,ownerId).then( result => {
        res.status(result.status).send(result.item);
    })
}

// POST api/item
const postItem = (req: Request, res: Response) => {
    const item: PracticeItem = req.body;
    addItem(item).then( result => {
        if (result.status !== 201) {
            res.status(result.status).send();
            return;
        }
        res.status(result.status).send(result.item);
    });

}

// PUT api/item/:userId/:id
const putItem = (req: Request, res: Response) => {
    const itemId = req.params.id;
    const ownerId= req.params.userId;
    const item = req.body;
    if (!itemId || !ownerId) {
        res.status(400).send();
        return;
    }
    updateItem(itemId, ownerId, item).then( result => {
        res.status(result.status).send(result.item);
    })
}

// DELETE api/item/:id
const deleteItem = (req: Request, res: Response) => {
    const id: string = req.params.id;
    delItem(id).then( result => {
        res.status(result.status).send();
    }).catch( err => {
        res.status(400).send();
    })
}

// PUT api/item/:userId/:id
const putStats = (req: Request, res: Response) => {
    const itemId = req.params.id;
    const ownerId= req.params.userId;
    const stat = req.body;
    if (!itemId || !ownerId) {
        res.status(400).send();
        return;
    }
    addStats(itemId, ownerId, stat).then( result => {
        res.status(result.status).send(result.item);
    })
}

// helper functions
const fetchItems = async (ownerId: string, stats? : boolean): Promise<ItemResult> => {
    const collection = await getCollection<PracticeItem>(collectionName);
    let items = await collection.find({ownerId}).toArray();
    if (stats) {
        items = items.filter(item => item.statisticName);
    }
    return {
        status: 200,
        items
    }
}


const fetchItem = async (itemId: string, ownerId: string): Promise<ItemResult> => {
    const collection = await getCollection<PracticeItem>(collectionName);
    const objId = new ObjectId(itemId);
    const item = await collection.findOne({_id: objId, ownerId});
    if (!item) {
        return {
            status: 404
        }
    }
    return {
        status: 200,
        item,
    }
}

const addItem = async (item: PracticeItem): Promise<ItemResult> => {
    const collection = await getCollection<PracticeItem>(collectionName);
    try {
        const res = await collection.insertOne(item);
        if (!res.acknowledged) {
            return {
                status: 500
            }
        }
        item._id = res.insertedId;
        return {
            status: 201,
            item
        }
    } catch {
        return {
            status: 400
        }
    }
}

const updateItem = async (itemId: string, ownerId: string, updatedItem: PracticeItem): Promise<ItemResult> => {
    const collection = await getCollection<PracticeItem>(collectionName);
    const originalResult = await fetchItem(itemId, ownerId);
    if (!originalResult.item) {
        return {
            status: originalResult.status
        }
    }
    const originalItem = originalResult.item;
    const filter = {
        _id: new ObjectId(itemId),
        ownerId
    }
    const set = {
        name: updatedItem.name? updatedItem.name : originalItem.name,
        description: updatedItem.description? updatedItem.description : originalItem.description,
        duration: updatedItem.duration? updatedItem.duration : originalItem.duration,
        repeats: updatedItem.repeats? updatedItem.repeats : originalItem.repeats,
        statisticName: updatedItem.statisticName? updatedItem.statisticName : originalItem.statisticName,
        videoLink: updatedItem.videoLink? updatedItem.videoLink : originalItem.videoLink,
        tags: updatedItem.tags !== undefined? updatedItem.tags : originalItem.tags,
        ownerId: updatedItem.ownerId? updatedItem.ownerId : originalItem.ownerId,
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
        await updateItemInSets(updatedItem,ownerId);
        return {
            status: 204,
        }
    } catch {
        return {
            status: 400
        }
    }
}

const delItem = async (itemId: string): Promise<ItemResult> => {
    const collection = await getCollection<PracticeItem>(collectionName);
    const objId = new ObjectId(itemId);
    try {
        const result = await collection.deleteOne({ _id: objId});
        if (!result.acknowledged) {
            return {
                status: 400
            }
        }
        await deleteItemInSets(itemId);
        return {
            status: 204
        }
    } catch {
        return {
            status: 400
        }
    }
}

const fetchTags = async (ownerId: string): Promise<ItemResult> => {
    const query = {
        "distinct": collectionName,
        "key": "tags",
        "query": {
            "ownerId": ownerId
        }
    }
    let result;
    result = await getCommandResult(query);
    if (result.ok !== 1) {
        return {
            status: 400
        }
    }
    return {
        status: 200,
        tags: result.values
    }
}

const addStats = async (itemId: string, ownerId: string, newStat: Stat): Promise<ItemResult> => {
    const collection = await getCollection<PracticeItem>(collectionName);
    const originalResult = await fetchItem(itemId, ownerId);
    if (!originalResult.item) {
        return {
            status: originalResult.status
        }
    }
    const originalItem = originalResult.item;
    const filter = {
        _id: new ObjectId(itemId),
        ownerId
    }

    const originalStats = originalItem.stats? originalItem.stats : []

    const set = {
        stats: [...originalStats,newStat]
    }

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

export const practiceRouter = express.Router();
practiceRouter.get("/item/:userId", getItems);
practiceRouter.get("/item/:userId/tags", getItemsTags);
practiceRouter.get("/item/:userId/:id", getItem)
practiceRouter.post("/item", postItem);
practiceRouter.put("/item/:userId/:id", putItem);
practiceRouter.put("/stats/:userId/:id",putStats);
practiceRouter.delete("/item/:id", deleteItem);

