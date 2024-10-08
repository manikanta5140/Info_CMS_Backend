import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentCategory } from './entities/content-category.entity';

@Injectable()
export class ContentCategoryService {
  constructor(
    @InjectRepository(ContentCategory)
    private contentCategoryRepository: Repository<ContentCategory>,
  ) {}

  /**************************************Category table service *************************** */
  async findAllContent(): Promise<ContentCategory[]> {
    return await this.contentCategoryRepository.find();
  }
  async findContentBySlug(slug: string): Promise<ContentCategory[]> {
    console.log('inside service2');
    console.log(slug);
    return await this.contentCategoryRepository.find({ where: { slug: slug } });
  }
}
