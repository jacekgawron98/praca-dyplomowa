interface AuthModel {
    account: User,
    token: string
}

interface User {
    _id?: string,
    login: string,
}