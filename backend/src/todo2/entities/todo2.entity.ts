import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TodoStatus {
  未着手 = '未着手',
  完了 = '完了',
  進行中 = '進行中',
}

@Entity()


export class Todo2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TodoStatus,  // statusの列挙
    default: TodoStatus.未着手,  // デフォルト値を指定
  })
  status: TodoStatus;  // statusの型を列挙の値に合わせる

  @Column({ type: 'varchar', length: 255 })
  todo: string;  // todoの内容

  @Column({ type: 'varchar', length: 512, nullable: true })
  memo?: string;  // memoはオプションに設定（nullable）

  @Column({ type: 'datetime' })
  addDate: Date;  // 日時

  @Column({ type: 'datetime', nullable: true })
  changeDate?: Date;  // 更新日時（nullable）

  @ManyToOne(() => User, user => user.todos, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default:false})
  isPublic: boolean;
}

