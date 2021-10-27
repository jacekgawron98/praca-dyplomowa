export const SignIn = async (login: string, password: string): Promise<AuthModel|undefined> => {
    let auth: AuthModel | undefined;
    const request ={
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({login: login, password: password})
    }
    let result;
    try {
        console.log(process.env.API_ADDRESS);
        result = await fetch(`${process.env.API_ADDRESS}/login`, request)
    } catch {
        throw 408;
    }

    if (result.ok) {
        const resultData: AuthModel = await result.json();
        if (resultData) {
            auth = resultData;
        }
    } else {
        throw result.status;
    }
    return auth;
}

export const SignUp = async (login: string, password: string): Promise<AuthModel|undefined> => {
    let auth: AuthModel | undefined;
    const request ={
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({login: login, password: password})
    }
    let result;
    try {
        result = await fetch(`${process.env.API_ADDRESS}/register`, request)
    } catch {
        throw 408;
    }
    if (result.ok) {
        const resultData: AuthModel = await result.json();
        if (resultData) {
            auth = resultData;
        }
    } else {
        throw result.status;
    }
    return auth;
}