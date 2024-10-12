import { DataSource } from "typeorm";
import { User } from "../models/user";
import { Task } from "../models/task";

export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER as string,
    password: process.env.DB_PSW as string,
    database: process.env.DB_NAME as string,
    entities: [User, Task],
    synchronize: true
});

export const connectToDatabase = () => {
    PostgresDataSource.initialize()
    .then(()=>{
        console.log("Connected to DB successfully now.");
    })
    .catch((error)=>{
        console.error("An error occured during DB connect : ", error);
    });
}