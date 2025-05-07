import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Test } from './test.entity'; 
import { TodoModule } from './todo/todo.module';
import { Todo2Module } from './todo2/todo2.module';
import { Todo2 } from './todo2/entities/todo2.entity';
import { Todo } from './todo/entities/todo.entity';
import { ConfigModule , ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:  `.env.${process.env.NODE_ENV}.local`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
      type: 'mysql',
      host:  config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      username: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_NAME'),
      entities: [Test, Todo2,Todo,User], // 'Test' と 'Todo2' を指定
      synchronize: true,
      logging: true,
    }),
    }),
    TodoModule,
    Todo2Module,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}