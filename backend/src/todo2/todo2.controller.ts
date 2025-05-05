import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { Todo2Service } from './todo2.service';
import { CreateTodo2Dto } from './dto/create-todo2.dto';
import { UpdateTodo2Dto } from './dto/update-todo2.dto';


@Controller('todo2')
export class Todo2Controller {
  constructor(private readonly todo2Service: Todo2Service) {}

  @Post()
  create(@Body() createTodo2Dto: CreateTodo2Dto) {
    console.log('Received createTodo2Dto:', createTodo2Dto);
    return this.todo2Service.create(createTodo2Dto);
  }

  // @Get()
  // async findAll(){
  //   return this.todo2Service.findAll();
  // }
  
  @Get()
  findAll(@Query('sort')sort?: string){
    return this.todo2Service.findAll(sort);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todo2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodo2Dto: UpdateTodo2Dto) {
    return this.todo2Service.update(+id, updateTodo2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todo2Service.remove(+id);
  }
  @Put(':id')
  updateTodo(@Param('id') id: string, @Body() updateTodo2Dto: UpdateTodo2Dto) {
    return this.todo2Service.update(+id, updateTodo2Dto);
  } 
}
