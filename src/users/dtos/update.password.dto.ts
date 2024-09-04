import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/)
  password: string;

  @IsNotEmpty()
  verifyPassword: string;
}
