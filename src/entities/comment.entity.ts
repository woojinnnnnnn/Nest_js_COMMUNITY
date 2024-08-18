import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Report } from './report.entity';
import { Board } from './board.entity';

@Entity('COMMENT')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => Report, (report) => report.comment)
  report: Report[];

  @OneToMany(() => Comment, (replies) => replies.replyTo)
  @JoinColumn()
  replies: Comment[]; // replies

  @ManyToOne(() => Comment, (replyTo) => replyTo.replies)
  @JoinColumn()
  replyTo: Comment; // 나중에 replyTo 로 변경.

  @ManyToOne(() => User, (user) => user.comment, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Board, (board) => board.comment, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'boardId', referencedColumnName: 'id' })
  board: Board;
}
