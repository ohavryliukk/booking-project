import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpUserDto } from './dto/signup-user-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async changeUser(dto: SignUpUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository
      .createQueryBuilder()
      .update({
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        status: Status.approved,
      })
      .where({
        email: dto.email,
      })
      .returning('*')
      .execute();
    return user.raw[0];
  }

  async getUsersByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return false;
    }
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ['bookings'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getAllUsers() {
    return this.userRepository
      .createQueryBuilder()
      .orderBy('User.userId', 'ASC')
      .select([
        'User.userId',
        'User.email',
        'User.firstName',
        'User.lastName',
        'User.role',
      ])
      .where({
        status: Status.approved,
      })
      .getMany();
  }
}
