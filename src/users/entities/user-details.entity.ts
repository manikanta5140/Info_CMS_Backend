import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('user_details')
export class UserDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column({
    nullable: true,
    default:
      'https://res.cloudinary.com/djyryzj1u/image/upload/v1728117185/aohrbick0qczyobxrhzv.webp',
  })
  profilePhoto: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({ nullable: true })
  mobileNumberVerificationCode: number;

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

  @OneToOne(() => Users, (users) => users.userDetails)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  users: Users;
}
