import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Posts } from './posts.entity';
import { PostedPlatforms } from './posted-platforms.entity';

@Entity('platforms')
@Unique(['platformName'])
export class Platforms {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  platformName: string;

  @CreateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)"})
  createdOn: Date;

  @UpdateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)",onUpdate:"CURRENT_TIMESTAMP(6)"})
  modifiedOn:Date;

  @OneToMany(() => PostedPlatforms, postedPlatforms => postedPlatforms.platforms)
  postedPlatforms: PostedPlatforms[];
}
