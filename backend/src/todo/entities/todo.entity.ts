import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity ()
export class Todo{
   @PrimaryGeneratedColumn()
    id: number;
    @Column()
    text: string;
    @Column({default: false})
    isCompleted: boolean;
}