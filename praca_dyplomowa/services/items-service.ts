import { defaultHeaders } from "../helpers/request_headers";

export const getItems = async (userId: string, token: string) : Promise<PracticeItem[]> => {
    let items: PracticeItem[] = [];
    const request ={
        method: 'GET',
        headers: defaultHeaders(token),
    }
    let result;
    try {
        console.log(process.env.API_ADDRESS)
        result = await fetch(`${process.env.API_ADDRESS}/item/${userId}`, request)
    } catch {
        throw 408;
    }

    if (result.ok) {
        const resultData: PracticeItem[] = await result.json();
        if (resultData) {
            items = resultData;
        }
    } else {
        throw result.status;
    }
    return items;
}

export const getItem = async (userId: string, itemId: string, token: string) : Promise<PracticeItem|undefined> => {
    let item: PracticeItem|undefined;
    const request ={
        method: 'GET',
        headers: defaultHeaders(token),
    }
    let result;
    try {
        console.log(process.env.API_ADDRESS)
        result = await fetch(`${process.env.API_ADDRESS}/item/${userId}/${itemId}`, request)
    } catch {
        throw 408;
    }

    if (result.ok) {
        const resultData: PracticeItem = await result.json();
        if (resultData) {
            item = resultData;
        }
    } else {
        throw result.status;
    }
    return item;
}

export const addItem = async (item: PracticeItem, token: string) : Promise<PracticeItem|undefined> => {
    const request ={
        method: 'POST',
        headers: defaultHeaders(token),
        body: JSON.stringify(item)
    }
    let result;
    try {
        console.log("add")
        result = await fetch(`${process.env.API_ADDRESS}/item`, request)
    } catch {
        throw 408;
    }
    if (result.ok) {
        const resultData: PracticeItem = await result.json();
        if (resultData) {
            item = resultData;
        }
    } else {
        return undefined
    }
    return item;
}

export const updateItem = async (item: PracticeItem, userId: string, token: string) : Promise<boolean> => {
    const request ={
        method: 'PUT',
        headers: defaultHeaders(token),
        body: JSON.stringify(item)
    }
    let result;
    try {
        console.log("update")
        result = await fetch(`${process.env.API_ADDRESS}/item/${userId}/${item._id}`, request)
    } catch {
        throw 408;
    }
    if (result.ok) {
        return true;
    } else {
        return false;
    }
}

export const deleteItem = async (itemId: string, token: string) : Promise<boolean> => {
    const request ={
        method: 'DELETE',
        headers: defaultHeaders(token),
    }
    let result;
    try {
        result = await fetch(`${process.env.API_ADDRESS}/item/${itemId}`, request)
    } catch {
        return false;
    }

    if (result.ok) {
        return true;
    } else {
        return false
    }
}

export const getTags = async (ownerId: string, token: string) : Promise<string[]> => {
    const request ={
        method: 'GET',
        headers: defaultHeaders(token),
    }
    let result;
    try {
        result = await fetch(`${process.env.API_ADDRESS}/item/${ownerId}/tags`, request)
    } catch {
        throw 404;
    }

    if (result.ok) {
        const resultData: string[] = await result.json();
        if (resultData) {
            return resultData;
        }
    } else {
        throw result.status;
    }
    return [];
}

export const addStat = async (stat: Stat, itemId: string, userId: string, token: string) : Promise<boolean> => {
    const request ={
        method: 'PUT',
        headers: defaultHeaders(token),
        body: JSON.stringify(stat)
    }
    let result;
    try {
        console.log(`update stat: ${itemId}`)
        result = await fetch(`${process.env.API_ADDRESS}/stats/${userId}/${itemId}`, request)
    } catch {
        throw 408;
    }
    if (result.ok) {
        return true;
    } else {
        return false;
    }
}