import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
  Req,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuardPayload } from 'src/auth/auth.guard';
import { Booking } from 'src/entities/booking.entity';
import { BookingsService } from './bookings.service';
import { BookingDto } from './dto/createBooking.dto';
import { RecurringBookingDto } from './dto/createRecurringBooking.dto';
import { Request } from 'express';
import { DatePeriodBookingsDto } from './dto/datePeriodBookingsdto';
import { UserBookingsDto } from './dto/userBookings.dto';
import { UpdateBookingDto } from './dto/updateBooking.dto';
import { UpdateRecurringBookingDto } from './dto/updateRecurringBooking.dto';

export interface UserRequest extends Request {
  user: any;
}

@Controller('bookings')
export class BookingsController {
  constructor(private bookingService: BookingsService) {}

  @UseGuards(AuthGuardPayload)
  @Get()
  async getBookingsByDate(
    @Query('roomId') roomId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<DatePeriodBookingsDto> {
    return this.bookingService.getBookingsByDate(roomId, startDate, endDate);
  }

  @UseGuards(AuthGuardPayload)
  @Get('own')
  async getBookingsByUserId(
    @Req() req: UserRequest,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<UserBookingsDto> {
    return this.bookingService.getBookingsByUserId(req.user.id, page, limit);
  }

  @Get('/:id')
  async getBookingById(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.getBookingById(id);
  }

  @UseGuards(AuthGuardPayload)
  @Post('one-time')
  @UsePipes(ValidationPipe)
  async createOne(
    @Body() dto: BookingDto,
    @Req() req: UserRequest,
  ): Promise<Booking> {
    return this.bookingService.addBooking(dto, req.user.id);
  }

  @UseGuards(AuthGuardPayload)
  @Post('recurring')
  @UsePipes(ValidationPipe)
  async addRecurringBooking(
    @Body() dto: RecurringBookingDto,
    @Req() req: UserRequest,
  ): Promise<any> {
    return this.bookingService.addRecurringBooking(dto, req.user.id);
  }

  @UseGuards(AuthGuardPayload)
  @Patch('one-time')
  @UsePipes(ValidationPipe)
  async updateOne(
    @Body() dto: UpdateBookingDto,
    @Req() req: UserRequest,
  ): Promise<Booking> {
    return this.bookingService.updateBookingById(dto, req.user);
  }

  @UseGuards(AuthGuardPayload)
  @Patch('recurring')
  @UsePipes(ValidationPipe)
  async updateRecurringBooking(
    @Body() dto: UpdateRecurringBookingDto,
    @Req() req: UserRequest,
  ): Promise<Booking[]> {
    return this.bookingService.updateRecurringBooking(dto, req.user);
  }

  @UseGuards(AuthGuardPayload)
  @Delete('one-time/:id')
  async deleteBookingById(
    @Req() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Booking> {
    return this.bookingService.deleteBookingById(id, req.user);
  }

  @UseGuards(AuthGuardPayload)
  @Delete('recurring/:id')
  async deleteReccuringBookingById(
    @Req() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Booking> {
    return this.bookingService.deleteReccuringBookingById(id, req.user);
  }
}
