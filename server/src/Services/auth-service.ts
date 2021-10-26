import mongodb from 'mongodb';
import bcrypt from 'bcrypt';
import { getCollection } from '../Helpers/database';
import config from '../config';
import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';

const collectionName = "auths";

type AuthResult = {
    account: User,
    token: string
}

const postAuthenticate = (req: Request, res: Response) => {
    const { login, password } = req.body;
    authenticate(login, password).then((account) => {
        if (!account) {
            res.status(401).send('Invalid login or password');
            return;
        }
        res.status(200).send(account)
    });
}

const postRegister = (req: Request, res: Response) => {
    const { login, password } = req.body;
    register(login, password).then( (account) => {
        if (!account) {
            res.status(409).send('Email already taken');
            return;
        }
        res.status(201).send(account);
    })
}

const authenticate = async (email: string, password: string): Promise<AuthResult> => {
    const collection = await getCollection<UserDbModel>(collectionName);
    const account = await collection.findOne({email});
    if (!account || !bcrypt.compare(password, account.password)) {
        return null;
    }
    const jwtToken = generateToken(account);
    return {
        account,
        token: jwtToken
    }
}

const register = async (email: string, password: string): Promise<AuthResult> => {
    const collection = await getCollection<UserDbModel>(collectionName);
    if (await collection.findOne({email})) return null;
    const account: UserDbModel = {
        login: email,
        password
    }
    account.password = bcrypt.hashSync(password, 10);
    await collection.insertOne(account);
    const jwtToken = generateToken(account);
    return {
        token: jwtToken,
        account
    }

}

const generateToken = (account: User) => {
    const salt = config.secret;
    return jwt.sign(
        { sub: account._id, id: account._id, },
        salt,
        { expiresIn: "60m" }
    );
};

export const authRouter = express.Router();
authRouter.post("/register", postRegister);
authRouter.post("/login", postAuthenticate);