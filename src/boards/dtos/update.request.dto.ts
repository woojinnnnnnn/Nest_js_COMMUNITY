import { IsNotEmpty, IsString } from "class-validator";

export class UpdateBoardDto {
      @IsString()
      @IsNotEmpty()
      title: string;

      @IsString()
      @IsNotEmpty()
      content: string
}