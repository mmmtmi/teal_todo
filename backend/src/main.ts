import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './fillter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
          }),
        ),
      }),
      new winston.transports.File({
        filename: 'logs/app.log',
        level: 'info',
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8080'],
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
