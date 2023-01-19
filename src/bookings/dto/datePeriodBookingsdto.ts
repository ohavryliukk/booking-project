import { Booking } from 'src/entities/booking.entity';

export class DatePeriodBookingsDto {
  period: {
    startDate: string;
    endDate: string;
  };
  bookings: Booking[];
}
