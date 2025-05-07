import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './fillter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // ログを有効化
    logger: ['log', 'warn', 'error', 'debug', 'verbose'], 
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://localhost:5173','http://localhost:8080']
  });
  app.useLogger(new Logger());
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
