import { IsNotEmpty } from 'class-validator';

export class InvitationDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  bookingId: number;
}
