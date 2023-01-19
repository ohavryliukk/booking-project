import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from 'src/bookings/bookings.controller';
import { BookingsModule } from 'src/bookings/bookings.module';
import { BookingsService } from 'src/bookings/bookings.service';
import { Booking } from 'src/entities/booking.entity';
import { Invitation } from 'src/entities/invitation.entity';
import { Room } from 'src/entities/room.entity';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';

@Module({
  controllers: [InvitationsController, BookingsController],
  providers: [InvitationsService, BookingsService, JwtService, UsersService],
  imports: [
    TypeOrmModule.forFeature([Booking, Invitation, User, Room]),
    forwardRef(() => BookingsModule),
  ],
  exports: [InvitationsService],
})
export class InvitationsModule {}
