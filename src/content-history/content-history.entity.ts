import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Users } from 'src/users/users.entity';

import { Posts } from 'src/posts/posts.entity';
import { ContentCategory } from 'src/Content-category/content-category.entity';
@Entity('content_history')
export class ContentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'categoryId' })
  categoryId: number;

  @Column('text')
  prompt: string;

  @Column('text')
  content: string;

  @Column()
  slug: string;
  
  @Column({ nullable: true })
  inputLable1Text: string;

  @Column({ nullable: true })
  inputLable2Text: string;

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

  @ManyToOne(
    () => ContentCategory,
    (contentCategory) => contentCategory.contentHistory,
  )
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  contentCategory: ContentCategory;

  @ManyToOne(() => Users, (users) => users.contentHistory)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  users: Users;

  @OneToOne(() => Posts, (posts) => posts.contentHistory)
  posts: Posts;
}
