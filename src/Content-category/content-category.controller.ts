import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ContentCategoryService } from './content-category.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('category')
export class ContentCategoryController {
  constructor(private contentCategoryService: ContentCategoryService) {}
  @UseGuards(AuthGuard)
  @Get('list')
  getAllContentCategory(): any {
    return this.contentCategoryService.findAllContent();
  }

  @UseGuards(AuthGuard)
  @Get(':slug')
  async getContentBySlug(@Req() req, @Param('slug') slug: string): Promise<any> {
    try{
      return await this.contentCategoryService.findContentBySlug(slug);
    }catch(error){
      throw error;
    }
    
  }
}
