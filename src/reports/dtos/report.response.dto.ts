import { IsEnum, IsOptional, IsString, IsInt } from 'class-validator';
import { reportTag } from 'src/entities/report.entity';
import { UserDTO } from './user.response.dto';
import { BoardDTO } from './board.response.dto';
import { CommentDTO } from './comment.response.dto';

export class ReportDTO {
  @IsInt()
  id: number;

  @IsString()
  reason: string;

  @IsEnum(reportTag)
  tags: reportTag;

  @IsOptional()
  board?: BoardDTO;

  @IsOptional()
  user?: UserDTO;

  @IsOptional()
  comment?: CommentDTO;

  @IsOptional()
  reporter?: UserDTO;
}
