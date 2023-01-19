import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Not correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @Length(4, 100, { message: 'Min 4, Max 100 characters!' })
  readonly password: string;
}
