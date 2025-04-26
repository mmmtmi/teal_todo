import { PartialType } from '@nestjs/mapped-types';
import { CreateTodo2Dto } from './create-todo2.dto';

export class UpdateTodo2Dto extends PartialType(CreateTodo2Dto) {}
