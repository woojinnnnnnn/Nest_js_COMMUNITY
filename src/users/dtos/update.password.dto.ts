import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string; 

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/)
  changePassword: string; 

  @IsNotEmpty()
  verifyPassword: string;
}