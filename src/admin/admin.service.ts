import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UsersService,
    private mailService: MailService,
  ) {}

  async createUser(dto: CreateUserDto[]): Promise<User[]> {
    for (const user of dto) {
      const guest = await this.userService.getUsersByEmail(user.email);
      if (guest) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.mailService.sendEmailVerification(user);
    }
    return await this.userRepository.save([...dto]);
  }
}
