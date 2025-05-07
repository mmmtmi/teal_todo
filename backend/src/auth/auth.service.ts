import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { access } from 'fs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ){}

    async validateUser(email: string, password: string):Promise<any>{
        const user = await this.userService.findByEmail(email)
        if (user && await bcrypt.compare(password,user.password)){
            const {password, ...result} = user;
            return result;
        }
        throw new UnauthorizedException('メールアドレスまたはパスワードが違います');

    }

    async login(user:any){
        const payload = {email: user.email, sub: user.id};
        return{
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(dto : CreateUserDto){
        const {email ,password} = dto

        const existingUser = await this.userService.findByEmail(email);
        if (existingUser){
            throw new BadRequestException('そのメールアドレスはすでに使われています。');
        }
        const hashedPassword = await bcrypt.hash(password,10);
        return this.userService.create({
            email,
            password: hashedPassword,
        });
    }
    
}
