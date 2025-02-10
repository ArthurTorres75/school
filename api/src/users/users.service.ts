import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      return user;
    } catch (error) {
      throw new Error('Failed to find user by email');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({ data: createUserDto });
    return newUser;
  }
}
