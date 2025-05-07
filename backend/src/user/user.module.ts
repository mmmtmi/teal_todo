import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ← これが必要！
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // AuthModule からも使えるように
})
export class UserModule {}