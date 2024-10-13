import * as dotenv from 'dotenv';
dotenv.config();

import * as express from "express";
import { connectToDatabase, PostgresDataSource } from "./configurations/db_connect";
import { User } from './models/user';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Task } from './models/task';

const app = express();
app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Task Management App')
});

//Login and authentication APIs here
app.post('/user/register', async (req: express.Request, res: express.Response): Promise<void> => {
    const { name, password } = req.body;
    try {
        const userRepository = await PostgresDataSource.getRepository(User);
        let user = await userRepository.findOne({where: {name}});
        if(!user){
            const hashedPassword = await bcryptjs.hash(password, 10);
            user = await userRepository.save({name, password: hashedPassword});
        }
        const jwtToken = jwt.sign({name: user.name}, process.env.JWT_SECRET);

        res.status(201).json({token: jwtToken});
        return;
    } catch (error) {
        res.status(500).json({message: error});
        return;
    }
})

app.post('/user/login', async (req: express.Request, res: express.Response): Promise<void> => {
    const { name, password } = req.body;
    try {
        const userRepository = PostgresDataSource.getRepository(User);
        let user = await userRepository.findOne({where: {name}});
        if(!user){
            res.status(401).json({message: "User not found"});
            return;
        }
        if(!(await bcryptjs.compare(password, user.password))){
            res.status(401).json({message: "Password is incorrect"});
            return;
        }

        const jwtToken = jwt.sign({userName: user.name}, process.env.JWT_SECRET);
        res.status(201).json({token: jwtToken});
        return;
    } catch (error) {
        res.status(500).json({message: error});
        return;
    }
})

//Task APIs
app.post('/create/task', async(req: express.Request, res: express.Response)=>{
    const {userName, title, status} = req.body;
    try {
        const userRepository = PostgresDataSource.getRepository(User);
        const userObj = await userRepository.findOne({where: {name: userName}});
        if(!userObj){
            res.status(401).json({message: "User not found"});
            return;
        }
        const taskObj = new Task();
        taskObj.status = status;
        taskObj.title = title;
        taskObj.user = userObj;
        const taskRepository = PostgresDataSource.getRepository(Task);
        const task = await taskRepository.save(taskObj);

        res.status(201).json({task: task});
        return;
    } catch (error) {
        res.status(500).json({error: error});
        return;
    }
});

app.get('/get/task/:userName', async(req: express.Request, res: express.Response)=>{
    const userName = req.params.userName;
    try {
        const taskRepository = PostgresDataSource.getRepository(Task);
        const userRepository = PostgresDataSource.getRepository(User);
        const userObj = await userRepository.findOne({where: {name: userName}});
        if(!userObj){
            res.status(401).json({message: "User not found"});
            return;
        }
        const listOfTasks = await taskRepository.find({where: {user: userObj}});
        
        res.status(200).json({tasks: listOfTasks});
        return;
    } catch (error) {
        res.status(500).json({message: error});
        return;
    }
});

app.put('/updatestatus/task', async(req: express.Request, res: express.Response)=>{
    const userName = String(req.query.username);
    const taskId = Number(req.query.taskid);
    const { status } = req.body;
    try {
        const taskRepository = PostgresDataSource.getRepository(Task);
        const taskObj = await taskRepository.findOne({where: {id: taskId}});
        const userRepository = PostgresDataSource.getRepository(User);
        const userObj = await userRepository.findOne({where: {name: userName}});
        if(!userObj){
            res.status(401).json({message: "User not found"});
            return;
        }
        taskObj.status = status;
        const newTaskObj = await taskRepository.save(taskObj);
        
        res.status(201).json({task: newTaskObj});
        return;
    } catch (error) {
        res.status(500).json({message: error});
        return;
    }
})

app.delete('/delete/task', async(req: express.Request, res: express.Response)=>{
    const userName = req.query.username.toString();
    const taskId = Number(req.query.taskid);
    try {
        const userRepository = PostgresDataSource.getRepository(User);
        const userObj = await userRepository.findOne({where: {name: userName}});
        if(!userObj){
            res.status(401).json({message: "User not found"});
            return;
        }

        const taskRepository = PostgresDataSource.getRepository(Task);
        await taskRepository.delete(taskId);
        res.status(201).json({message: "Task is deleted"});
        return;
    } catch (error) {
        res.status(500).json({error: error});
        return;
    }
});

connectToDatabase();
app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port 1010`)
})