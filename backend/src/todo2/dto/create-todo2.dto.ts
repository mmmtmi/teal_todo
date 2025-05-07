import { IsOptional,IsEnum,IsString,Length, IsDate, IsNumber, IsDateString } from 'class-validator';
import { TodoStatus } from '../entities/todo2.entity';

export class CreateTodo2Dto {
    @IsEnum(TodoStatus)
     status: TodoStatus;

    @IsString()
    @Length(1, 255)
    todo: string;
  
    @IsOptional()
    @IsString()
    @Length(0, 512)
    memo?: string;
  
    @IsDateString()
    addDate: Date;
  
    @IsOptional()
    @IsDateString()
    changeDate?: Date;

    @IsOptional()
    isPublic? : boolean;
  }
  