import express, {Application} from 'express';

import * as http from "http";
import cors from 'cors';

export const app: Application = express();

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}))

app.get("/", function (req, res) {
    res.status(201).json("hi");
});

const httpServer = http.createServer(app);
export default httpServer;

