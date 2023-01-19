import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingsService } from 'src/bookings/bookings.service';
import { InvitationDto } from './dto/invitation.dto';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private invitationService: InvitationsService,
    private bookingService: BookingsService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: InvitationDto): Promise<any> {
    const booking = await this.bookingService.getBookingById(dto.bookingId);
    if (booking) {
      return await this.invitationService.addInvitation(dto);
    }
    throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
  }
}
