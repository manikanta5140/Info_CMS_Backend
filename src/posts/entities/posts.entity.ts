import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { ContentHistory } from '../../content-history/entities/content-history.entity';
import { Platforms } from './platforms.entity';
import { PostedPlatforms } from './posted-platforms.entity';
import { PostsScheduler } from 'src/posts-scheduler/entity/posts-scheduler.entity';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'contentHistoryId' })
  contentHistoryId: number;

  @Column({ nullable: true })
  imageUrl: string;

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

  @ManyToOne(() => Users, (users) => users.posts)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  users: Users;

  @OneToMany(() => PostedPlatforms, (postedPlatforms) => postedPlatforms.posts)
  postedPlatforms: PostedPlatforms[];

  @OneToOne(() => ContentHistory, (contentHistory) => contentHistory.posts)
  @JoinColumn([{ name: 'contentHistoryId', referencedColumnName: 'id' }])
  contentHistory: ContentHistory;

  @OneToMany(() => PostsScheduler, (scheduledPost) => scheduledPost.posts)
  scheduledPost: PostsScheduler[];
}
