import { IsInt, IsString } from 'class-validator';

export class BoardDTO {
  @IsInt()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
