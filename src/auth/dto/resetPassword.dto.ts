import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Not correct email' })
  readonly email: string;
}
