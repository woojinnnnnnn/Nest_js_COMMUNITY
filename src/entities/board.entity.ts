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
import { Comment } from './comment.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Like } from './like.entity';

@Entity('BOARD')
export class Board {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'int', default: 0 }) 
  veiwCount: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  @OneToMany(() => Comment, (comment) => comment.board)
  comment: Comment[];

  @OneToMany(() => Report, (report) => report.board)
  report: Report[]

  @OneToMany(() => Like, (like) => like.board)
  like: Like[]

  @ManyToOne(() => User, (user) => user.board, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;


}
