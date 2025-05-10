import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodo2Dto } from './dto/create-todo2.dto';
import { UpdateTodo2Dto } from './dto/update-todo2.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo2 } from './entities/todo2.entity';
import { Logger } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class Todo2Service {
  private readonly logger = new Logger(Todo2Service.name);
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

async findAll(userId: number, sort?: string): Promise<Todo2[]> {
  console.log('Received sort param:', sort);

  const query = this.todoRepository
    .createQueryBuilder('Todo2')
    .leftJoin('Todo2.user', 'user')
    .where('Todo2.isPublic = true OR user.id = :userId', { userId });

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
  
  
  
  
  

  async create(createTodoDto: CreateTodo2Dto, userId: number): Promise<Todo2> {
    this.logger.log(`Creating Todo with status: ${createTodoDto.status}`);

    const todo = this.todoRepository.create({
      ...createTodoDto,
      user: { id: userId },
    });
  
    return await this.todoRepository.save(todo);
  }
  
  
  

  async findOne(id: number): Promise<Todo2> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`TODO with id ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodo2Dto ,userId:number): Promise<Todo2> {
    const todo = await this.todoRepository.findOne({ where:{id}, relations:['user']});
    if(!todo || todo.user.id !== userId){
      throw new ForbiddenException('このTODOを編集する権限がありません');
    }
    Object.assign(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async remove(id: number, userId: number) {
    const todo = await this.todoRepository.findOne({ where: { id }, relations: ['user'] });
    if (!todo || todo.user.id !== userId) {
      throw new ForbiddenException('このTODOを削除する権限がありません');
    }
    return this.todoRepository.remove(todo);
  }
  
  async findMyTodos(userId: number): Promise<Todo2[]>{
    return this.todoRepository.find({
      where: { user: { id:userId}},
    });
  }

  async findPublicTodos():Promise<Todo2[]>{
    return this.todoRepository.find({
      where: {isPublic: true}
    })
  }
  async findByUser(userId: number): Promise<Todo2[]>{
    return this.todoRepository.find({where: {user: { id:userId}}});
  }
}

