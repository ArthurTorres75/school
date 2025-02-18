import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { handleError } from 'src/helpers/errors.helper';

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
      console.log('signUp: ', createUserDto);
      const user = await this.usersService.create(createUserDto);

      const payload = { sub: user.id, username: user.username };

      return {
        message: 'successfully signed up',
        user: payload,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async forgotPassword(email: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Aquí puedes generar un token de restablecimiento de contraseña y enviarlo por correo electrónico
      const resetToken = await this.jwtService.signAsync(
        { sub: user.id },
        { expiresIn: '1h' },
      );

      // Enviar el token por correo electrónico (implementa tu lógica de envío de correo aquí)
      // await this.mailService.sendResetPasswordEmail(user.email, resetToken);

      return {
        message: 'Password reset email sent',
      };
    } catch (error) {
      handleError(error);
    }
  }

  async logOut(): Promise<any> {
    // La invalidación de tokens JWT generalmente se maneja en el lado del cliente
    // o mediante una lista negra de tokens en el servidor.
    return {
      message: 'Successfully logged out',
    };
  }
}
