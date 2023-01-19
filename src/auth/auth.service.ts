import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/entities/user.entity';
import { SignUpUserDto } from 'src/users/dto/signup-user-dto';
import { SignInUserDto } from 'src/users/dto/signin-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { MailService } from 'src/mail/mail.service';
import generator from 'generate-password-ts';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signin(UserDto: SignInUserDto) {
    const user = await this.validateUser(UserDto);
    return this.generateToken(user);
  }

  async signup(UserDto: SignUpUserDto) {
    let user = await this.userService.getUsersByEmail(UserDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.status === 'approved') {
      throw new HttpException(
        'User with this email ia already registered',
        HttpStatus.CONFLICT,
      );
    }
    user = await this.userService.changeUser(UserDto);
    return this.generateToken(<User>user);
  }

  async changePassword(dto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new HttpException(
        'User with this email was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.status === 'pending') {
      throw new HttpException('User in not approved!', HttpStatus.FORBIDDEN);
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (!passwordEquals) {
      throw new HttpException(
        'The current password is not valid',
        HttpStatus.FORBIDDEN,
      );
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new HttpException(
        'User with this email was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.status === 'pending') {
      throw new HttpException('User in not approved!', HttpStatus.FORBIDDEN);
    }

    const newPassword = generator.generate({
      length: 10,
      numbers: true,
    });
    await this.mailService.sendPassResetEmail(dto.email, newPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  private generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(userDto: SignInUserDto) {
    const user = await this.userService.getUsersByEmail(userDto.email);
    if (user) {
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (user && passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException();
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
