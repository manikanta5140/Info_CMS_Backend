import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/users.entity';
import { History } from 'src/content-history/content-history.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'userId'})
  userId: number;

  @Column({name:'contentHistoryId'})
  contentHistoryId: number;

  @Column({ nullable: true })
  image_url: string;

//   @ManyToOne(() => User, { nullable: false })
//   user: User;

//   @ManyToOne(() => History, { nullable: true })
//   history: History;

//   @ManyToOne(() => Platform, { nullable: false })
//   platform: Platform;

  @CreateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)"})
  createdOn: Date;

  @UpdateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)",onUpdate:"CURRENT_TIMESTAMP(6)"})
  modifiedOn:Date;

}
