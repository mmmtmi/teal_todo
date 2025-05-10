import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { promises } from 'dns';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
    ){}

    async create(createUserDto: CreateUserDto): Promise<User>{
        const {email , password} = createUserDto;

        const existingUser = await this.userRepository.findOne({where : {email}});
        if (existingUser){
            throw new Error('このメールアドレスはすでに使われています。');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
        });

        return this.userRepository.save(user);
    }

    async update(id: number, updateUserDto:UpdateUserDto):Promise<User>{
        const user = await this.userRepository.findOne({where:{id}});
        if (!user){
            throw new Error('ユーザーが見つかりません');
        }

        if(updateUserDto.password){
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
      } 

}