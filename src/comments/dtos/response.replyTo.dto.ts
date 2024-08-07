import { Comment } from "src/entities/comment.entity";

export class ReplyToResponseDto {
  id: number;
  content: string;
  createdAt: Date;

  constructor(replyTo: Comment) {
    this.id = replyTo.id;
    this.content = replyTo.content;
    this.createdAt = replyTo.createdAt;
  }
}
