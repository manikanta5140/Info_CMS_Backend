import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Posts } from './posts.entity';
import { PostedPlatforms } from './posted-platforms.entity';
import { UserVerifiedPlatform } from '../../userVerifiedPlatforms/entity/user-verified-platform.entity';
import { UserSocialMediaCredential } from '../../social-medias/DTOs/user-social-media-credential.entity';
import { PostsScheduler } from 'src/posts-scheduler/entity/posts-scheduler.entity';

@Entity('platforms')
@Unique(['platformName'])
export class Platforms {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  platformImage: string;

  @Column()
  platformName: string;

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

  @OneToMany(
    () => PostedPlatforms,
    (postedPlatforms) => postedPlatforms.platforms,
  )
  postedPlatforms: PostedPlatforms[];

  @OneToMany(
    () => UserVerifiedPlatform,
    (userVerifiedPlatform) => userVerifiedPlatform.platforms,
  )
  verifiedPlatforms: UserVerifiedPlatform[];

  @OneToMany(
    () => UserSocialMediaCredential,
    (userVerifiedPlatform) => userVerifiedPlatform.user,
  )
  socialMediaCredentials: UserSocialMediaCredential[];

  @OneToMany(() => PostsScheduler, (postsScheduler) => postsScheduler.platforms)
  scheduledPostPlatform: PostsScheduler[];
}
