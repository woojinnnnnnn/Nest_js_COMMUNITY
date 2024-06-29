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
import { Community } from './community.entity';

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

  @OneToMany(() => Comment, (childComment) => childComment.parentComment)
  @JoinColumn()
  childComments: Comment[];

  @ManyToOne(() => Comment, (parentComment) => parentComment.childComments)
  @JoinColumn()
  parentComment: Comment;

  @ManyToOne(() => User, (user) => user.comment, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Community, (community) => community.comment, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'communityId', referencedColumnName: 'id' })
  community: Community;
}
