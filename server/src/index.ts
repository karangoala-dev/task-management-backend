import * as dotenv from 'dotenv';
dotenv.config();

import * as express from "express";
import { connectToDatabase, PostgresDataSource } from "./configurations/db_connect";
import { User } from './models/user';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Task Management App')
});

//Login and authentication routes here
app.post('/user/register', async (req: express.Request, res: express.Response) => {
    const { name, password } = req.body;
    try {
        const userRepository = await PostgresDataSource.getRepository(User);
        let user = await userRepository.findOne({where: {name}});
        if(!user){
            const hashedPassword = await bcryptjs.hash(password, 10);
            user = await userRepository.save({name, password: hashedPassword});
        }
        const jwtToken = jwt.sign({name: user.name}, process.env.JWT_SECRET);

        return res.status(201).json({token: jwtToken});
    } catch (error) {
        return res.status(500).json({message: error});
    }
})

app.post('/user/login', async (req: express.Request, res: express.Response): Promise<Response> => {
    const { name, password } = req.body;
    try {
        const userRepository = PostgresDataSource.getRepository(User);
        let user = await userRepository.findOne({where: {name}});
        if(!user){
            return res.status(401).json({message: "User not found"});
        }
        if(!(await bcryptjs.compare(password, user.password))){
            return res.status(401).json({message: "Password is incorrect"});
        }

        const jwtToken = jwt.sign({userName: user.name}, process.env.JWT_SECRET);
        return res.status(201).json({token: jwtToken});
    } catch (error) {
        return res.status(500).json({message: error});
    }
})

connectToDatabase();
app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port 1010`)
})