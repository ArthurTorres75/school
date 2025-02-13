import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  @Put('/:userId')
  async updateUser(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(
      userId,
      updateUserDto.username,
      updateUserDto.email,
    );
  }

  @Delete('/:userId')
  async deleteUser(@Param('userId') userId: number) {
    return await this.usersService.deleteUser(userId);
  }
}
