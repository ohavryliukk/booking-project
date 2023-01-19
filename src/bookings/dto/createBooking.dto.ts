import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class BookingDto {
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @Length(4, 40, { message: 'Min 4, Max 40 characters!' })
  title: string;

  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @Length(4, 200, { message: 'Min 4, Max 200 characters!' })
  description: string;

  @IsNotEmpty()
  @IsInt()
  roomId: number;

  @IsNotEmpty()
  startDateTime: string;

  @IsNotEmpty()
  endDateTime: string;

  isRecurring: boolean;

  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  invitations: number[];
}
