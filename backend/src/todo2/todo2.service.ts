import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodo2Dto } from './dto/create-todo2.dto';
import { UpdateTodo2Dto } from './dto/update-todo2.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo2 } from './entities/todo2.entity';

@Injectable()
export class Todo2Service {
  findAndCount(options: { skip: number; take: number; }) {
    return this.todoRepository.findAndCount({
      skip: options.skip,
      take: options.take,
      order: {id: 'ASC'},
    });
  }
  constructor(
    @InjectRepository(Todo2)
    private todoRepository: Repository<Todo2>,
  ) {}

  async findAll(sort?: string): Promise<Todo2[]> {
    console.log('Received sort param:', sort);
  
    const query = this.todoRepository.createQueryBuilder('Todo2');
  
    const validFields = ['createdAt', 'updatedAt', 'name'];
    const validOrders = ['asc', 'desc'];
    const map: Record<string, string> = {
      createdAt: 'addDate',
      updatedAt: 'changeDate',
      name: 'todo',
    };
  
    if (sort) {
      const [field, order] = sort.split('_');
      if (validFields.includes(field) && validOrders.includes(order)) {
        const column = map[field];
        const direction = order.toUpperCase() as 'ASC' | 'DESC';
  
        console.log(`Applying ORDER BY: Todo2.${column} ${direction}`);
        query.orderBy(`Todo2.${column}`, direction);
      }
    }
  
    return await query.getMany();
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

