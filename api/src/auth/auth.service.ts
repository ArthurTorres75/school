import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = user?.password !== password ? false : true;
      const isEmailValid = user?.email !== email ? false : true;

      if (!isPasswordValid || !isEmailValid) {
        throw new UnauthorizedException();
      }

      const payload = { sub: user.id, username: user.username };

      return {
        message: 'successfully logged in',
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.usersService.create(createUserDto);

      const payload = { sub: user.id, username: user.username };

      return {
        message: 'successfully signed up',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
