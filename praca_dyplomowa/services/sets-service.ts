import { defaultHeaders } from "../helpers/request_headers";

export const getSets = async (userId: string, token: string) : Promise<PracticeSet[]> => {
    let items: PracticeSet[] = [];
    const request ={
        method: 'GET',
        headers: defaultHeaders(token),
    }
    let result;
    try {
        console.log(process.env.API_ADDRESS)
        result = await fetch(`${process.env.API_ADDRESS}/set/${userId}`, request)
    } catch {
        throw 408;
    }

    if (result.ok) {
        const resultData: PracticeSet[] = await result.json();
        if (resultData) {
            items = resultData;
        }
    } else {
        throw result.status;
    }
    return items;
}

export const addSet = async (set: PracticeSet, token: string) : Promise<PracticeSet|undefined> => {
    const request ={
        method: 'POST',
        headers: defaultHeaders(token),
        body: JSON.stringify(set)
    }
    let result;
    try {
        console.log("add set")
        result = await fetch(`${process.env.API_ADDRESS}/set`, request)
    } catch {
        throw 408;
    }
    if (result.ok) {
        const resultData: PracticeSet = await result.json();
        if (resultData) {
            set = resultData;
        }
    } else {
        return undefined
    }
    return set;
}

export const updateSet = async (set: PracticeSet, userId: string, token: string) : Promise<boolean> => {
    const request ={
        method: 'PUT',
        headers: defaultHeaders(token),
        body: JSON.stringify(set)
    }
    let result;
    try {
        console.log("update set")
        result = await fetch(`${process.env.API_ADDRESS}/set/${userId}/${set._id}`, request)
    } catch {
        throw 408;
    }
    if (result.ok) {
        return true;
    } else {
        return false;
    }
}

export const deleteSet = async (setId: string, token: string) : Promise<boolean> => {
    const request ={
        method: 'DELETE',
        headers: defaultHeaders(token),
    }
    let result;
    try {
        result = await fetch(`${process.env.API_ADDRESS}/set/${setId}`, request)
    } catch {
        return false;
    }

    if (result.ok) {
        return true;
    } else {
        return false
    }
}

export const getCalendar = async (ownerId: string, token: string) : Promise<Calendar|undefined> => {
    const request = {
        method: 'GET',
        headers: defaultHeaders(token),
    }
    let result;
    try {
        result = await fetch(`${process.env.API_ADDRESS}/calendar/${ownerId}`, request)
    } catch {
        return undefined;
    }

    if (result.ok) {
        const resultData: Calendar = await result.json();
        return resultData? resultData : undefined;
    } else {
        return undefined
    }
}

export const getNextSet = async (ownerId: string, token: string) : Promise<PracticeSet|undefined> => {
    const request = {
        method: 'GET',
        headers: defaultHeaders(token),
    }
    let result;
    try {
        result = await fetch(`${process.env.API_ADDRESS}/nextset/${ownerId}`, request)
    } catch {
        return undefined;
    }

    if (result.ok) {
        const resultData: PracticeSet = await result.json();
        return resultData? resultData : undefined;
    } else {
        return undefined
    }
}

export const getHistory = async (ownerId: string, token: string) : Promise<PracticeHistory[]> => {
    let history: PracticeHistory[] = [];
    const request ={
        method: 'GET',
        headers: defaultHeaders(token),
    }
    let result;
    try {
        console.log(process.env.API_ADDRESS)
        result = await fetch(`${process.env.API_ADDRESS}/history/${ownerId}`, request)
    } catch {
        throw 408;
    }

    if (result.ok) {
        const resultData: PracticeHistory[] = await result.json();
        if (resultData) {
            history = resultData;
        }
    } else {
        console.log(result.status);
        throw result.status;
    }
    return history;
}

export const addHistory = async (history: PracticeHistory, token: string) : Promise<PracticeHistory|undefined> => {
    const request ={
        method: 'POST',
        headers: defaultHeaders(token),
        body: JSON.stringify(history)
    }
    let result;
    try {
        console.log("add history")
        result = await fetch(`${process.env.API_ADDRESS}/history`, request)
    } catch {
        throw 408;
    }
    if (result.ok) {
        const resultData: PracticeHistory = await result.json();
        if (resultData) {
            history = resultData;
        }
    } else {
        return undefined
    }
    return history;
}