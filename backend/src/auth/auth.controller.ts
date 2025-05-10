import { Controller,Post,Body,UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
        private readonly userService:UserService
    ){}

    @Post('login')
    async login(@Body() body:{email:string; password:string}){
        const user = await this.authService.validateUser(body.email, body.password);
        if(!user){
            throw new UnauthorizedException('認証に失敗しました');
        }
        return this.authService.login(user);
    }
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto);
    }

}
