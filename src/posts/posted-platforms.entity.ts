import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Post } from './posts.entity';
import { Platform } from './platforms.entity';

@Entity('posted_platforms')
export class PostedPlatform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'userId'})
  userId: number;

  @Column({name:'contentHistoryId'})
  postId: number;

  @Column({name:'platformId'})
  platformId: number;

//   @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
//   user: User;

//   @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
//   post: Post;

//   @ManyToOne(() => Platform, (platform) => platform.id, { onDelete: 'CASCADE' })
//   platform: Platform;

@CreateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)"})
createdOn: Date;

@UpdateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)",onUpdate:"CURRENT_TIMESTAMP(6)"})
modifiedOn:Date;

}