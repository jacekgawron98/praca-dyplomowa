import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../Helpers/database';

const collectionName = "items"

interface ItemResult {
    status: number;
    item?: PracticeItem;
    items?: PracticeItem[];
}
// GET api/item
const getItems = (req: Request, res: Response<PracticeItem[]>) => {
    const items: PracticeItem[] = []
    res.status(200).send(items);
}

// GET api/item/:id
const getItem = (req: Request, res: Response<PracticeItem>) => {
    throw new Error("Not implemented");
}

// POST api/item
const postItem = (req: Request, res: Response) => {
    const item: PracticeItem = req.body;
    addItem(item).then( result => {
        if (result.status !== 201) {
            res.status(result.status).send();
        }
        res.status(result.status).send(result.item);
    });

}

// PUT api/item/:id
const putItem = (req: Request, res: Response) => {
    throw new Error("Not implemented");
}

// DELETE api/item/:id
const deleteItem = (req: Request, res: Response) => {
    const id: string = req.params.id;
    delItem(id).then( result => {
        res.status(result.status).send();
    })
}

// helper functions
const addItem = async (item: PracticeItem): Promise<ItemResult> => {
    const collection = await getCollection<PracticeItem>(collectionName);
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

export const practiceRouter = express.Router();
practiceRouter.get("/item", getItems);
practiceRouter.get("/item/:id", getItem)
practiceRouter.post("/item", postItem);
practiceRouter.put("/item/:id", putItem);
practiceRouter.delete("/item/:id", deleteItem);

