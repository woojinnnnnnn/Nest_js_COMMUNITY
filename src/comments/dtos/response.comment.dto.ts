import { Comment } from 'src/entities/comment.entity';

export class CommentResponseDto {
      id: number;
      content: string;
      createdAt: Date;
      userId: number;
      communityId: number;
      parentCommentId: number | null;
    
      constructor(comment: Comment) {
        this.id = comment.id;
        this.content = comment.content;
        this.createdAt = comment.createdAt;
        this.userId = comment.user.id;
        this.communityId = comment.community.id;
        this.parentCommentId = comment.parentComment ? comment.parentComment.id : null;
      }
    }

    