import { Controller, Get, Param, Req } from '@nestjs/common';
import { ContentCategoryService } from './content-category.service';


@Controller('category')
export class ContentCategoryController {
  constructor(private contentCategoryService: ContentCategoryService) {}
  // @UseGuards(AuthGuard)
  @Get('list')
  getAllContentCategory(): any {
    return this.contentCategoryService.findAllContent();
  }
  @Get(':slug')
  getContentBySlug(@Req() req, @Param('slug') slug: string): any {
    // console.log(req.params);
    // console.log(slug);
    // const res=await this.contentCategoryService.findContentBySlug(slug);
    // if(res.length===0){return }
    return this.contentCategoryService.findContentBySlug(slug);
  }
}
