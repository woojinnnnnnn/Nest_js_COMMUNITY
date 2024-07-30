import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class SignUpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nickName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$ %^&*-]).{8,30}$/)
  // 8 ~ 10 자 문자 또는 특수문자 정규 표현.
  password: string;
}
