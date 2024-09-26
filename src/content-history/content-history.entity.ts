import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/users.entity';
import { ContentCategory } from './content-category.entity';

@Entity('content_history')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'user_id'})
  user_id: number;

  @Column({name:'category_id'})
  category_id: number;

  @Column('text')
  prompt: string;

  @Column('text')
  content: string;

  @CreateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)"})
  createdOn: Date;

  @UpdateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)",onUpdate:"CURRENT_TIMESTAMP(6)"})
  modifiedOn:Date;


//   @ManyToOne(() => User, { nullable: false })
//   user: User;

//   @ManyToOne(() => ContentCategory, { nullable: false })
//   category: ContentCategory;
}
