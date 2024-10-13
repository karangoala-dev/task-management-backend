import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";
import { IsString } from "class-validator";

@Entity()
export class Task{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar'
    })
    title: string;

    @Column({
        type: 'varchar'
    })
    status: string;

    @ManyToOne(()=>User, (user)=>user.tasks)
    user: User;

    toString(): string{
        return `Task Data{
            id: ${this.id},
            title: ${this.title},
            status: ${this.status},
            user: ${this.user.name}
        }`;
    }
}