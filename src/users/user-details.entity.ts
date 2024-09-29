import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity('user_details')
export class UserDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'userId'})
  userId: number;

  @Column({nullable:true})
  profilePhoto: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({nullable:true})
  gender: string;

  @Column({nullable:true})
  dateOfBirth: Date;

  @Column({nullable:true})
  mobileNumber: string;

  @CreateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)"})
  createdOn: Date;

  @UpdateDateColumn({type:'timestamp',default:()=>"CURRENT_TIMESTAMP(6)",onUpdate:"CURRENT_TIMESTAMP(6)"})
  modifiedOn:Date;

  @OneToOne(() => Users, users => users.UserDetail)
  @JoinColumn([{name:'userId',referencedColumnName:'id'}])
  users: Users;

}

