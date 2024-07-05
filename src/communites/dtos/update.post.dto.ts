import { IsNotEmpty, IsString } from "class-validator";

export class UpdateComuDto {
      @IsString()
      @IsNotEmpty()
      title: string;

      @IsString()
      @IsNotEmpty()
      content: string
}