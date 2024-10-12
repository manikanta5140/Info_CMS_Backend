import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserDetails } from './user-details.entity';
import { ContentHistory } from '../../content-history/entities/content-history.entity';
import { Posts } from '../../posts/entities/posts.entity';
import { PostedPlatforms } from '../../posts/entities/posted-platforms.entity';
import { UserVerifiedPlatform } from '../../userVerifiedPlatforms/entity/user-verified-platform.entity';
import { UserSocialMediaCredential } from '../../social-medias/DTOs/user-social-media-credential.entity';
import { PostsScheduler } from 'src/posts-scheduler/entity/posts-scheduler.entity';

@Entity('users')
@Unique(['userName', 'email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isMobileVerified: boolean;

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

  @OneToOne(() => UserDetails, (userDetail) => userDetail.users)
  userDetails: UserDetails;

  @OneToMany(() => ContentHistory, (contentHistory) => contentHistory.users)
  contentHistory: ContentHistory[];

  @OneToMany(() => Posts, (posts) => posts.users)
  posts: Posts[];

  @OneToMany(() => PostedPlatforms, (postedPlatforms) => postedPlatforms.users)
  postedPlatforms: PostedPlatforms[];

  @OneToMany(
    () => UserVerifiedPlatform,
    (userVerifiedPlatform) => userVerifiedPlatform.user,
  )
  verifiedPlatforms: UserVerifiedPlatform[];

  @OneToMany(
    () => UserSocialMediaCredential,
    (userVerifiedPlatform) => userVerifiedPlatform.user,
  )
  socialMediaCredentials: UserSocialMediaCredential[];

  @OneToMany(
    () => PostsScheduler,
    (userScheduledPosts) => userScheduledPosts.id,
  )
  scheduledPosts: PostsScheduler[];
}
