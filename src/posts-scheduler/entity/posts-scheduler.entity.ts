import { Platforms } from 'src/posts/entities/platforms.entity';
import { Posts } from 'src/posts/entities/posts.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts_scheduler')
export class PostsScheduler {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  platformId: number;

  @Column({ type: 'date' })
  scheduledDate: string;

  @Column()
  postId: number;

  @Column({ type: 'time' })
  scheduledTime: string;

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

  @ManyToOne(() => Users, (users) => users.scheduledPosts)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  users: Users;

  @ManyToOne(() => Platforms, (platforms) => platforms.scheduledPostPlatform)
  @JoinColumn([{ name: 'platformId', referencedColumnName: 'id' }])
  platforms: Platforms;

  @ManyToOne(() => Posts, (posts) => posts.scheduledPost)
  @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
  posts: Posts;
}
