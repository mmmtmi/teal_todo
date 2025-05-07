import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodo2Dto } from './dto/create-todo2.dto';
import { UpdateTodo2Dto } from './dto/update-todo2.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo2 } from './entities/todo2.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo2)
    private todoRepository: Repository<Todo2>,
  ) {}

  findAll(): Promise<Todo2[]> {
    return this.todoRepository.find();
  }

  async create(createTodoDto: CreateTodo2Dto,userId: number): Promise<Todo2> {
    const todo = this.todoRepository.create(createTodoDto);
    return this.todoRepository.save(todo);
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

