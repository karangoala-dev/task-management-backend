import * as express from "express";

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Task Management App')
});

app.listen(1010, ()=>{
    console.log(`Server running on port 1010`)
})