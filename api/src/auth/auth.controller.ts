import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from './constants';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('logout')
  async logOut() {
    return this.authService.logOut();
  }
}
