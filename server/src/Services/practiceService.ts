import express, { Request, Response } from 'express';

const getItems = (req: Request, res: Response) => {
    res.status(200).send("Hello world");
}

export const practiceRouter = express.Router();
practiceRouter.get("/items", getItems);

