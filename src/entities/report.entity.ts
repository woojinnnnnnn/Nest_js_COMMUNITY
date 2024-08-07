import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';
import { Comment } from './comment.entity';
import { User } from './user.entity';

export enum reportTag {
  COMMUNITY = 'COMMUNITY',
  USER = 'USER',
  COMMENT = 'COMMENT',
}

@Entity('REPORT')
export class Report {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar' })
  reason: string;

  @Column({ type: 'varchar' })
  tags: reportTag;

  @ManyToOne(() => Board, (board) => board.report, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'boardId', referencedColumnName: 'id' })
  board: Board;

  @ManyToOne(() => User, (user) => user.report, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.report, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId', referencedColumnName: 'id' })
  comment: Comment;

  @ManyToOne(() => User, (reporter) => reporter.report, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'reporterId', referencedColumnName: 'id' })
  reporter: User; // 신고'한' 유저의 id
}
