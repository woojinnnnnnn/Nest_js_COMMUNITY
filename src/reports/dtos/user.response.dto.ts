// user.dto.ts

import { IsEmail, IsInt, IsString } from 'class-validator';

export class UserDTO {
  @IsInt()
  id: number;

  @IsEmail()
  email: string;

  @IsString()
  nickName: string;

  @IsString()
  role: string;
}
