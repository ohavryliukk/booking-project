import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export enum Days {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export class UpdateRecurringBookingDto {
  @IsNotEmpty()
  @IsNumber()
  recurringId: number;

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
  startDate: string;

  @IsNotEmpty()
  endDate: string;

  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  @IsEnum(Days, {
    each: true,
    message: `Each value in daysOfWeek must be a valid: [0,1,2,3,4,5,6]`,
  })
  daysOfWeek: Days[];

  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  invitations: number[];
}
