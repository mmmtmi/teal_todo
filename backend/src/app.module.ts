import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Test } from './test.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'banana',
      database: 'teal_todo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // ← ここ
      synchronize: true,
      logging: true, // ← 追加でクエリ出力も確認できる
    }),
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}