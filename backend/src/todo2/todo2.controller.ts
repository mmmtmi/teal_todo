import { Controller, Get, Post, Body, Patch, Param, UseGuards , Delete, Put, Query,Header, Req ,Logger} from '@nestjs/common';
import { Todo2Service } from './todo2.service';
import { CreateTodo2Dto } from './dto/create-todo2.dto';
import { UpdateTodo2Dto } from './dto/update-todo2.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { AuthGuard } from '@nestjs/passport';


@UseGuards(AuthGuard('jwt'))
@Controller('todo2')
export class Todo2Controller {
  private readonly logger = new Logger(Todo2Controller.name);
  constructor(private readonly todo2Service: Todo2Service) {}


@UseGuards(AuthGuard('jwt'))
@Post()
async create(@Body() createTodo2Dto: CreateTodo2Dto, @Req() req) {
  try {
    this.logger.log(`Received request to create Todo: ${JSON.stringify(createTodo2Dto)}`);
    const userId = req.user.id;
    return this.todo2Service.create(createTodo2Dto, userId);
  } catch (error) {
    this.logger.error('Error creating todo', error.stack);
    throw error; // 再スローしてNestJSが適切に処理できるようにする
  }
} 

  // @Get()
  // async findAll(){
  //   return this.todo2Service.findAll();
  // }
  
  @Get()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate') // 強めのキャッシュ制御
  @Header('Pragma', 'no-cache') // HTTP/1.0用
  @Header('Expires', '0') // 古いキャッシュ対策
  findAll(@Req() req:any, @Query('sort')sort?: string){
    const userId = req.user?.id;
    console.log('Controller sort param:', sort);  
    return this.todo2Service.findAll(userId, sort);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todo2Service.findOne(+id);
  }j

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateTodo2Dto, @Req() req) {
    return this.todo2Service.update(id, dto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    return this.todo2Service.remove(id, req.user.id);
  }

  @Get('my')
  getMytodos(@Req() req){
    const userId = req.user.id;
    return this.todo2Service.findMyTodos(userId);
  } 
  @Get('public')
  getPublicTodos(){
    return this.todo2Service.findPublicTodos();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async findUserTodos(@Req() req){
    const userId = req.user.id;
    return this.todo2Service.findByUser(userId);
  }
}
