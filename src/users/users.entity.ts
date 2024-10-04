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
import { ContentHistory } from 'src/content-history/content-history.entity';
import { Posts } from 'src/posts/posts.entity';
import { PostedPlatforms } from 'src/posts/posted-platforms.entity';
import { UserVerifiedPlatform } from 'src/userVerifiedPlatforms/entity/user-verified-platform.entity';
import { UserSocialMediaCredential } from 'src/social-medias/DTOs/user-social-media-credential.entity';

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

  // @Column({ default: false })
  @Column({ nullable: true })
  isVerified: boolean;

  // @Column({ nullable: false })
  @Column({ nullable: true })
  verificationCode: string;

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
}
