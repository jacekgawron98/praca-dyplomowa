import express from 'express';
import { practiceRouter } from './Services/practiceService';

const PORT = 5000;

const app = express();
app.use(express.json());

app.use("/api", practiceRouter);

app.listen(PORT, ()=> {
    console.log(`[log] Server is running at port ${PORT}`);
})