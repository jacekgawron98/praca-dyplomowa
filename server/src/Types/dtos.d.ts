interface UserDbModel {
    login: string,
    password: string,
}

interface User extends UserDbModel {
    _id?: string,
    
}