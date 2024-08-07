import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBoardDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  content: string;
}
