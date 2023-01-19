import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { Booking } from 'src/entities/booking.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Booking])],
  exports: [UsersService],
})
export class UsersModule {}
