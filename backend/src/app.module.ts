import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Test } from './test.entity';  // Test エンティティをインポート
import { TodoModule } from './todo/todo.module';
import { Todo2Module } from './todo2/todo2.module';
import { Todo2 } from './todo2/entities/todo2.entity';
import { Todo } from './todo/entities/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'banana',
      database: 'teal_todo',
      entities: [Test, Todo2,Todo], // 'Test' と 'Todo2' を指定
      synchronize: true,
      logging: true,
    }),
    TodoModule,
    Todo2Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}