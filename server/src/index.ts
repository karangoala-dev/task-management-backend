import * as express from "express";
import { connectToDatabase } from "./configurations/db_connect";
import * as dotenv from 'dotenv';
const app = express();
dotenv.config();

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Task Management App')
});

connectToDatabase();

app.listen(process.env.APP_PORT, ()=>{
    console.log(`Server running on port 1010`)
})