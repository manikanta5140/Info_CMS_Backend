import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ContentHistory } from './content-history.entity';

@Entity('content_category')
@Unique(['categoryName'])
export class ContentCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryName: string;

  @CreateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)"})
  createdOn: Date;

  @UpdateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)",onUpdate:"CURRENT_TIMESTAMP(6)"})
  modifiedOn:Date;

  @OneToMany(() => ContentHistory, contentHistory => contentHistory.contentCategory)
  contentHistory: ContentHistory[];
}
