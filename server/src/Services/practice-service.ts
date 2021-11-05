import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection, getCommandResult } from '../Helpers/database';

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
    fetchItems(ownerId).then( result => {
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
    })
}

// helper functions
const fetchItems = async (ownerId: string): Promise<ItemResult> => {
    const collection = await getCollection<PracticeItem>(collectionName);
    const items = await collection.find({ownerId}).toArray();
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
        // TO DO update dla zestawów
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

const delItem = async (itemId: string): Promise<ItemResult> => {
    const collection = await getCollection<PracticeItem>(collectionName);
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

export const practiceRouter = express.Router();
practiceRouter.get("/item/:userId", getItems);
practiceRouter.get("/item/:userId/tags", getItemsTags);
practiceRouter.get("/item/:userId/:id", getItem)
practiceRouter.post("/item", postItem);
practiceRouter.put("/item/:userId/:id", putItem);
practiceRouter.delete("/item/:id", deleteItem);

