import { Module } from '@nestjs/common';
import { Todo2Service } from './todo2.service';
import { Todo2Controller } from './todo2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo2 } from './entities/todo2.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo2])], // ← ここが大事！！
  controllers: [Todo2Controller],
  providers: [Todo2Service],
})
export class Todo2Module {}
