import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Posts } from './posts.entity';
import { Platforms } from './platforms.entity';
import { Users } from 'src/users/entities/users.entity';

@Entity('posted_platforms')
export class PostedPlatforms {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'postId' })
  postId: number;

  @Column({ name: 'platformId' })
  platformId: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdOn: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  modifiedOn: Date;

  @ManyToOne(() => Users, (users) => users.postedPlatforms)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  users: Users;

  @ManyToOne(() => Posts, (posts) => posts.postedPlatforms)
  @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
  posts: Posts;

  @ManyToOne(() => Platforms, (platforms) => platforms.postedPlatforms)
  @JoinColumn([{ name: 'platformId', referencedColumnName: 'id' }])
  platforms: Platforms;
}
