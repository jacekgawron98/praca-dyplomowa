import express from 'express';
import expressJwt from 'express-jwt';
import config from './config';
import cors from 'cors';
import { connectToDatabase } from './Helpers/database';
import { authRouter } from './Services/auth-service';
import { practiceRouter } from './Services/practice-service';
import { setsRouter } from './Services/sets-service';
import { historyRouter } from './Services/history-service';

const PORT = 5000;

const checkIfAuthenticated = expressJwt({
    secret: config.secret,
    algorithms: ['HS256']
})

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRouter)
app.use("/api", checkIfAuthenticated, practiceRouter);
app.use("/api", checkIfAuthenticated, setsRouter);
app.use("/api", checkIfAuthenticated, historyRouter);

app.listen(PORT, ()=> {
    connectToDatabase();
    console.log(`[log] Server is running at port ${PORT}`);
})