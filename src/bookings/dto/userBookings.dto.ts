import { Booking } from 'src/entities/booking.entity';

export class UserBookingsDto {
  bookings: Booking[];
  page: number;
  limit: number;
  totalCount: number;
}
