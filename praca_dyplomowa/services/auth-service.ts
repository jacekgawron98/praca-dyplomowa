export const SignIn = async (login: string, password: string): Promise<AuthModel|undefined> => {
    let auth: AuthModel | undefined;
    const request ={
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({login: login, password: password})
    }
    const result = await fetch('http://192.168.1.2:5000/api/login', request)
    if (result.ok) {
        const resultData: AuthModel = await result.json();
        if (resultData) {
            auth = resultData;
        }
    } else {
        throw new Error(`${result.status}`);
    }
    return auth? auth : undefined;
}

export const SignUp = async (login: string, password: string): Promise<AuthModel> => {
    let auth: any;
    console.log(`l: ${login}, h: ${password}`);
    return auth;
}