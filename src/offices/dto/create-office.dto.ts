import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateOfficeDto {
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @Length(4, 40, { message: 'Min 4, Max 40 characters!' })
  name: string;

  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @Length(4, 70, { message: 'Min 4, Max 70 characters!' })
  address: string;
}
