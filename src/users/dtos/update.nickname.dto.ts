import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateNickNameDto {
      @IsString()
      @IsNotEmpty()
      @MaxLength(50)
      nickName: string
}
