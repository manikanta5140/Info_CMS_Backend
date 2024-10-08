import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentHistory } from './entities/content-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContentHistoryService {
  constructor(
    @InjectRepository(ContentHistory)
    private contentHistoryRepository: Repository<ContentHistory>,
  ) {}

  async findAll(userId: number): Promise<ContentHistory[]> {
    return await this.contentHistoryRepository.find({
      where: {
        userId: userId,
      },
    });
  }

  async findOne(id: number): Promise<ContentHistory> {
    return await this.contentHistoryRepository.findOneBy({ id });
  }

  async create(
    contentHistory: Partial<ContentHistory>,
  ): Promise<ContentHistory> {
    contentHistory = this.contentHistoryRepository.create(contentHistory);
    return await this.contentHistoryRepository.save(contentHistory);
  }

  async update(
    id: number,
    updateData: Partial<ContentHistory>,
  ): Promise<ContentHistory> {
    await this.contentHistoryRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<any> {
    return await this.contentHistoryRepository.delete(id);
  }


}
