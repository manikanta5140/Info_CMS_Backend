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
} from 'typeorm';
import { Users } from 'src/users/users.entity';
import { ContentHistory } from 'src/content-history/content-history.entity';
import { Platforms } from './platforms.entity';
import { PostedPlatforms } from './posted-platforms.entity';

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
}
