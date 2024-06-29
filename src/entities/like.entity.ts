import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Community } from './community.entity';

@Entity('LIKE')
export class Like {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'boolean' })
  flag: boolean;

  @ManyToOne(() => User, (user) => user.like, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Community, (community) => community.like, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'communityId', referencedColumnName: 'id' })
  community: Community;
}
