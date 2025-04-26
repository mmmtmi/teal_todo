import { IsOptional,IsEnum,IsString,Length, IsDate, IsNumber, IsDateString } from 'class-validator';


export class CreateTodo2Dto {
    @IsEnum(['未着手', '完了', '進行中'])
    status: '未着手' | '完了' | '進行中'; 

    @IsString() // statusの型を列挙の値に合わせる
    @Length(1, 255)  // todoの内容の長さを制限
    todo: string;  // todoの内容

    @IsOptional()
    @IsString()
    @Length(0, 512)  // memoの長さを制限
    memo?: string;  // memoはオプションに設定（nullable）

    @IsDateString()
    addDate: Date;  // 日時

    @IsOptional()
    @IsDateString()
    changeDate?: Date;  // 更新日時（nullable）

}