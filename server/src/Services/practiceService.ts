import express, { Request, Response } from 'express';

const getItems = (req: Request, res: Response<PracticeItem[]>) => {
    const items: PracticeItem[] = [
        {
            id: "asdfgsdg",
            name: "item1",
            repeats: 30
        },
        {
            id: "asadfdsasf",
            name: "item2",
            duration: 300
        }
    ]
    res.status(200).send(items);
}

export const practiceRouter = express.Router();
practiceRouter.get("/items", getItems);

