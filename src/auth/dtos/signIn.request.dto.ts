import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class SignInRequestDto {
      @IsEmail()
      @IsString()
      @IsNotEmpty()
      email: string

      @IsString()
      @IsNotEmpty()
      password: string
}