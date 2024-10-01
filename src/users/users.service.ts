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
    
      async findById(id: number): Promise<Users> {
        return await this.usersRepository.findOne({where: { id }, relations: {userDetails: true}});
      }
    
      async create(userData: any): Promise<any> {
        const newUser = this.usersRepository.create(userData);
        return await this.usersRepository.save(newUser);
      }

      async createUserDetails(data: any): Promise<UserDetails> {
        return await this.userDetailsRepository.save(data)
      }
    
      async update(id: number, updatedUser: Partial<Users>): Promise<any> {
        console.log(updatedUser)
        return await this.usersRepository.update(id,updatedUser);
      }
}


