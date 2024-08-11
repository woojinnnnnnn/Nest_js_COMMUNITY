import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class SignUpVerifyPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nickName: string;

  @IsString()
  @IsNotEmpty()
  // 8 ~ 10 자 문자 또는 특수문자 정규 표현.
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/)
  password: string;

  @IsNotEmpty()
  verifyPassword: string;
}
