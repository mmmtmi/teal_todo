import { IsOptional, IsString, IsBoolean } from 'class-validator';
export class CreateTodoDto {
    @IsString()
    text: string;
    @IsOptional()
    @IsBoolean()
    done?: boolean;
}
