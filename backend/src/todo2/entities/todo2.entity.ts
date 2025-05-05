import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Todo2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['未着手', '完了', '進行中'],  // statusの列挙
    default: '未着手',  // デフォルト値を指定
  })
  status: '未着手' | '完了' | '進行中';  // statusの型を列挙の値に合わせる

  @Column({ type: 'varchar', length: 255 })
  todo: string;  // todoの内容

  @Column({ type: 'varchar', length: 512, nullable: true })
  memo?: string;  // memoはオプションに設定（nullable）

  @Column({ type: 'datetime' })
  addDate: Date;  // 日時

  @Column({ type: 'datetime', nullable: true })
  changeDate?: Date;  // 更新日時（nullable）

}

