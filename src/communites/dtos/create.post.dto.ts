import { IsNotEmpty, IsString } from "class-validator";

export class CreateComuDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
