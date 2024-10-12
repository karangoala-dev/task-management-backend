import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './task';
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar'
    })
    name: string;

    @Column({
        type: 'varchar'
    })
    password: string;

    @OneToMany(()=>Task, (task)=>task.user)
    tasks: Task[]
}