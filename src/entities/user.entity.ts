import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Community } from './community.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

export enum UserStatus {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

@Entity('USER')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', default: UserStatus.CLIENT })
  role: UserStatus;

  @Column({ type: 'varchar', nullable: true })
  hashedRefreshToken: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  @OneToMany(() => Community, (community) => community.user)
  community: Community[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  readonly readOnlyData: {
    email: string;
  };
}
