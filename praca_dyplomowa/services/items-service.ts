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