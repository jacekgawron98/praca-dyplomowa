import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../Helpers/database';

const collectionName = "sets"

interface SetResult {
    status: number;
    set?: PracticeSet;
    sets?: PracticeSet[];
    calendar?: object;
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

// GET api/calendar/:userId
const getCalendar = (req: Request, res: Response) => {
    const ownerId: string = req.params.userId;
    generateCalendar(ownerId).then( result => {
        res.status(result.status).send(result.calendar);
    })
}

// GET api/nextset/:userId
const getNextSet = (req: Request, res: Response) => {
    const ownerId: string = req.params.userId;
    findNextSet(ownerId).then( result => {
        res.status(result.status).send(result.set);
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

const generateCalendar = async (ownerId: string) : Promise<SetResult> => {
    const collection = await getCollection<PracticeSet>(collectionName);
    const sets = await collection.find({ownerId}).toArray();
    const plannedSets = sets.filter(set => set.plannedTime);
    return {
        status: 200,
        calendar: {
            monday: sortSetsByTime(plannedSets.filter(set => set.plannedTime.day === "monday")),
            tuesday: sortSetsByTime(plannedSets.filter(set => set.plannedTime.day === "tuesday")),
            wednesday: sortSetsByTime(plannedSets.filter(set => set.plannedTime.day === "wednesday")),
            thursday: sortSetsByTime(plannedSets.filter(set => set.plannedTime.day === "thursday")),
            friday: sortSetsByTime(plannedSets.filter(set => set.plannedTime.day === "friday")),
            saturday: sortSetsByTime(plannedSets.filter(set => set.plannedTime.day === "saturday")),
            sunday: sortSetsByTime(plannedSets.filter(set => set.plannedTime.day === "sunday"))
        }
    }
}

const findNextSet = async (ownerId: string) : Promise<SetResult> => {
    const collection = await getCollection<PracticeSet>(collectionName);
    const sets = await collection.find({ownerId}).toArray();
    const plannedSets = sets.filter(set => set.plannedTime);
    if (plannedSets.length === 0) return {
        status: 404
    };
    return {
        status: 200,
        set: plannedSets.sort(compareFullTime)[0]
    }
}

const compareFullTime = (a: PracticeSet, b: PracticeSet) => {
    const now = new Date(Date.now());
    const dayNow = convertDayToNumber(now.toLocaleDateString("en-US",{weekday: "long"}));
    const timeNow = now.getHours() * 60 + now.getMinutes();
    const time1 = convertDayToMinutes(dayNow, convertDayToNumber(a.plannedTime.day)) * a.plannedTime.hour * 60 + a.plannedTime.minute;
    const time2 = convertDayToMinutes(dayNow, convertDayToNumber(b.plannedTime.day)) * b.plannedTime.hour * 60 + b.plannedTime.minute;
    const diffTime1 = Math.abs(timeNow - time1);
    const diffTime2 = Math.abs(timeNow - time2);
    return diffTime1 >= diffTime2? 1 : -1;
}

const sortSetsByTime = (sets: PracticeSet[]) => {
    const compareTime = (a: PracticeSet, b: PracticeSet) => {
        const time1 = a.plannedTime.hour * 60 + a.plannedTime.minute;
        const time2 = b.plannedTime.hour * 60 + b.plannedTime.minute;
        return time1 >= time2? 1 : -1
    }
    return sets.sort(compareTime);
}

const convertDayToMinutes = (startDay: number, endDay: number) => {
    const t = 24*3600;
    switch (startDay) {
        case 0: {
            return endDay * t;
        }
        case 1: {
            return endDay < startDay? (6 + endDay) * t : (endDay-1) * t;
        }
        case 2: {
            return endDay < startDay? (5 + endDay) * t : (endDay-2) * t;
        }
        case 3: {
            return endDay < startDay? (4 + endDay) * t : (endDay-3) * t;
        }
        case 4: {
            return endDay < startDay? (3 + endDay) * t : (endDay-4) * t;
        }
        case 5: {
            return endDay < startDay? (2 + endDay) * t : (endDay-5) * t;
        }
        case 6: {
            return endDay < startDay? (1 + endDay) * t : (endDay-6) * t;
        }
    }
}

const convertDayToNumber = (day: string) => {
    day = day.toLowerCase();
    switch (day) {
        case "monday": {
            return 0;
        }
        case "tuesday": {
            return 1;
        }
        case "wednesday": {
            return 2;
        }
        case "thursday": {
            return 3;
        }
        case "friday": {
            return 4;
        }
        case "saturday": {
            return 5;
        }
        case "sunday": {
            return 6;
        }
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
setsRouter.get("/nextset/:userId",getNextSet);
setsRouter.get("/calendar/:userId",getCalendar);
setsRouter.get("/set/:userId", getSets);
setsRouter.get("/set/:userId/:id", getSet)
setsRouter.post("/set", postSet);
setsRouter.put("/set/:userId/:id", putSet);
setsRouter.delete("/set/:id", deleteSet);