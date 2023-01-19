import { forwardRef, Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from 'src/entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';
import { JwtService } from '@nestjs/jwt';
import { Invitation } from 'src/entities/invitation.entity';
import { InvitationsService } from 'src/invitations/invitations.service';
import { InvitationsController } from 'src/invitations/invitations.controller';
import { InvitationsModule } from 'src/invitations/invitations.module';
import { Room } from 'src/entities/room.entity';
import { MailService } from 'src/mail/mail.service';

@Module({
  providers: [
    BookingsService,
    UsersService,
    MailService,
    InvitationsService,
    JwtService,
  ],
  controllers: [BookingsController, UsersController, InvitationsController],
  imports: [
    TypeOrmModule.forFeature([Booking, User, Invitation, Room]),
    UsersModule,
    forwardRef(() => InvitationsModule),
  ],
  exports: [BookingsService],
})
export class BookingsModule {}
