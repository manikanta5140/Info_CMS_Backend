import { ContentHistory } from 'src/content-history/entities/content-history.entity';
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
  contentHistoryId: number;

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

  @ManyToOne(
    () => ContentHistory,
    (contentHistory) => contentHistory.scheduledPost,
  )
  @JoinColumn([{ name: 'contentHistoryId', referencedColumnName: 'id' }])
  contentHistory: ContentHistory;
}
