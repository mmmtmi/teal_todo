import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service'; // AuthServiceがちゃんとインポートされているか確認
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // ここはそのまま
import { JwtStrategy } from './jwt.strategy';
import { Todo2Module } from 'src/todo2/todo2.module';


@Module({
  imports: [
    Todo2Module,
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
