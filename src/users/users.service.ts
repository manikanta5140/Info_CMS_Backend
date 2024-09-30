import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from './user-details.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,

        @InjectRepository(UserDetails)
        private userDetailsRepository: Repository<UserDetails>
      ) {}
    
      async findAll(): Promise<Users[]> {
        return await this.usersRepository.find();
      }
    
      async findByEmail(email: string): Promise<Users> {
        return await this.usersRepository.findOne({ where: { email }, relations:{userDetails: true}});
      }
    
      async findOne(id: number): Promise<Users> {
        return await this.usersRepository.findOneBy({ id });
      }
    
      async create(data: any): Promise<Users> {
        return await this.usersRepository.save(data);
      }

      async createUserDetails(data: any): Promise<UserDetails> {
        return await this.userDetailsRepository.save(data)
      }
    
      async update(id: number, user: Users): Promise<Users> {
        return await this.usersRepository.save(user);
      }
}
