import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
