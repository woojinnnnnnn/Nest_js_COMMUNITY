import { Comment } from 'src/entities/comment.entity';
import { UserResponseDto } from './response.user.dto';
import { ReplyToResponseDto } from './response.replyTo.dto';

export class CommentResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  user: UserResponseDto;
  communityId: number;
  // replyToId: number | null;
  replyTo : ReplyToResponseDto | null;

  constructor(comment: Comment) {
    this.id = comment.id;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
    this.user = new UserResponseDto(comment.user); 
    this.communityId = comment.board.id;
    // this.replyToId = comment.replyTo ? comment.replyTo.id : null;
    this.replyTo = comment.replyTo ? new ReplyToResponseDto(comment.replyTo) : null; // replyTo 객체로 변환 
  }
}
