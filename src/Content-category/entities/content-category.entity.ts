  import { ContentHistory } from 'src/content-history/entities/content-history.entity';
import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

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

    @Column({nullable: true})
    formLabel1: string;

    @Column({nullable: true})
    formField1: string;

    @Column({nullable: true})
    formName1: string;

    @Column({default: true})
    formRequired1: boolean;

    @Column({nullable: true})
    formLabel2: string;

    @Column({nullable: true})
    formField2: string;

    @Column({nullable: true})
    formName2: string;
    @Column({default: false})
    formRequired2: boolean;

    @CreateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)"})
    createdOn: Date;

    @UpdateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)",onUpdate:"CURRENT_TIMESTAMP(6)"})
    modifiedOn:Date;

    @OneToMany(() => ContentHistory, contentHistory => contentHistory.contentCategory)
    contentHistory: ContentHistory[];
  }
