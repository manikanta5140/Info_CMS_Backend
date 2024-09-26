import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './users.entity';

@Entity('user_details')
export class UserDetail {
  @PrimaryGeneratedColumn()
  id: number;

//   @OneToOne(() => User)
//   @JoinColumn({ name: 'user_id' })
//   user: User;

  @Column()
  user_id: number;

  @Column({nullable:true})
  profile_photo: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  dateOfBirth: Date;

  @Column({ unique: true })
  mobile_no: string;

  @CreateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)"})
  createdOn: Date;

  @UpdateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)",onUpdate:"CURRENT_TIMESTAMP(6)"})
  modifiedOn:Date;

  @ManyToOne(() => Chall, type => type.challenges)
  @JoinColumn([{name:'typeId',referencedColumnName:'id'}])
  ChallengeType: ChallengeType;

}

