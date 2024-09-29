import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentHistory } from './content-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContentHistoryService {
    constructor(
        @InjectRepository(ContentHistory)
        private usersRepository: Repository<ContentHistory>
      ) {}
    
      async findAll(userId: number): Promise<ContentHistory[]> {
        return await this.usersRepository.find({where:{userId:userId}});
      }
    
      async findOne(id: number): Promise<ContentHistory> {
        return await this.usersRepository.findOneBy({ id });
      }
    
      async create(contentHistory: Partial<ContentHistory>): Promise<ContentHistory> {
        return this.usersRepository.create(contentHistory);
      }
    
      async update(id: number, user: ContentHistory): Promise<ContentHistory> {
        return await this.usersRepository.save(user);
      }

      async delete(id: number): Promise<any> {
        return await this.usersRepository.delete(id);
      }

}
