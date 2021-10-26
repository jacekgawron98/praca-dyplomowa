export const SignIn = async (login: string, password: string): Promise<AuthModel|undefined> => {
    let auth: AuthModel | undefined;
    const request ={
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({login: login, password: password})
    }
    let result;
    try {
        result = await fetch('http://192.168.1.2:5000/api/login', request)
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
        result = await fetch('http://192.168.1.2:5000/api/register', request)
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