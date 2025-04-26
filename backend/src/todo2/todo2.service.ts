import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodo2Dto } from './dto/create-todo2.dto';
import { UpdateTodo2Dto } from './dto/update-todo2.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo2 } from './entities/todo2.entity';

@Injectable()
export class Todo2Service {
  constructor(
    @InjectRepository(Todo2)
    private todoRepository: Repository<Todo2>,
  ) {}

  findAll(): Promise<Todo2[]> {
    return this.todoRepository.find();
  }

  async create(createTodoDto: CreateTodo2Dto): Promise<Todo2> {
    const todo = this.todoRepository.create(createTodoDto);
    console.log('保存されるデータ:', todo);  // 保存前のデータを確認
  
    try {
      const savedTodo = await this.todoRepository.save(todo);
      console.log('保存されたデータ:', savedTodo);  // 保存後のデータを確認
      return savedTodo;
    } catch (error) {
      console.error('保存エラー:', error);
      throw new Error('保存に失敗しました');
    }
  }
  

  async findOne(id: number): Promise<Todo2> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`TODO with id ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodo2Dto): Promise<Todo2> {
    await this.todoRepository.update(id, updateTodoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TODO with id ${id} not found`);
    }
  }
}

