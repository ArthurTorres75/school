import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { handleError } from 'src/helpers/errors.helper';

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
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );

      const user = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      if (user) {
        throw new NotFoundException('User already exists');
      }

      const newUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
      return newUser;
    } catch (error) {
      handleError(error);
    }
  }

  async updatePassword(userId: number, newPassword: string): Promise<User> {
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async validatePassword(
    userId: number,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(newPassword, user.password);
      return isPasswordValid;
    } catch (error) {
      throw new Error(error);
    }
  }
}
