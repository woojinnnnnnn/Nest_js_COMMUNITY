import { IsInt, IsString } from 'class-validator';

export class CommentDTO {
  @IsInt()
  id: number;

  @IsString()
  content: string;
}