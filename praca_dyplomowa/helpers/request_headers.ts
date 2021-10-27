export const defaultHeaders = (token?: string, customHeaders?: any) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': token? `Bearer ${token}` : ""
    }
}