import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { SignInUserDto } from 'src/users/dto/signin-user.dto';
import { SignUpUserDto } from 'src/users/dto/signup-user-dto';
import { AuthGuardPayload } from './auth.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/signin')
  signin(@Body() userDto: SignInUserDto) {
    return this.authService.signin(userDto);
  }

  @UsePipes(ValidationPipe)
  @Post('/signup')
  signup(@Body() userDto: SignUpUserDto) {
    return this.authService.signup(userDto);
  }

  @UseGuards(AuthGuardPayload)
  @UsePipes(ValidationPipe)
  @Post('/auth/change-password')
  @HttpCode(204)
  async changePassword(@Body() dto: ChangePasswordDto): Promise<void> {
    await this.authService.changePassword(dto);
  }

  @UsePipes(ValidationPipe)
  @Post('/auth/reset-password')
  @HttpCode(204)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto);
  }
}
