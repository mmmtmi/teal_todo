import { Todo2 } from "src/todo2/entities/todo2.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todo2, todo => todo.user)
  todos: Todo2[];

}
