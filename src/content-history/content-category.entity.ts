  import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
  import { ContentHistory } from './content-history.entity';

  @Entity('content_category')
  @Unique(['categoryName'])
  export class ContentCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoryName: string;

    @Column()
    description: string;

    @Column()
    iconUrl: string;

    @Column()
    aiPrompt:string;

    @Column()
    slug:string;

    @Column()
    formLabel1: string;

    @Column()
    formField1: string;

    @Column()
    formName1: string;

    @Column({default: false})
    formRequired: boolean;

    @Column({nullable: true})
    formLabel2: string;

    @Column({nullable: true})
    formField2: string;

    @Column({nullable: true})
    formName2: string;

    @CreateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)"})
    createdOn: Date;

    @UpdateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)",onUpdate:"CURRENT_TIMESTAMP(6)"})
    modifiedOn:Date;

    @OneToMany(() => ContentHistory, contentHistory => contentHistory.contentCategory)
    contentHistory: ContentHistory[];
  }
