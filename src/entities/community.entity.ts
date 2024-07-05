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
import { Comment } from './comment.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Like } from './like.entity';

@Entity('COMMUNITY')
export class Community {
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

  @OneToMany(() => Comment, (comment) => comment.community)
  comment: Comment[];

  @ManyToOne(() => User, (user) => user.community, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Like, (like) => like.community)
  like: Like;
      community: { id: number; };
}
