import { Controller, Get, Param, Req } from '@nestjs/common';
import { ContentHistoryService } from './content-history.service';

@Controller('category')
export class ContentCategoryController {
  constructor(private contentHistoryService: ContentHistoryService) {}
  // @UseGuards(AuthGuard)
  @Get('list')
  getAllContentCategory(): any {
    return this.contentHistoryService.findAllContent();
  }
  @Get(':slug')
  getContentBySlug(@Req() req, @Param('slug') slug: string): any {
    // console.log(req.params);
    // console.log(slug);
    // const res=await this.contentHistoryService.findContentBySlug(slug);
    // if(res.length===0){return }
    return this.contentHistoryService.findContentBySlug(slug);
  }
}
