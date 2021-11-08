import { defaultHeaders } from "../helpers/request_headers";

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