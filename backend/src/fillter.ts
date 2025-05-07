import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : 500; // 例外がHttpExceptionの場合、getStatus()を使用

    // エラーログを表示
    console.error(exception);

    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal server error', // メッセージがあれば、それを使う
    });
  }
}