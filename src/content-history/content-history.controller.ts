import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ContentHistoryDto } from './DTOs/content-history.dto';
import { ContentHistoryService } from './content-history.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateContentHistoryDto } from './DTOs/update-content-history.dto';

@Controller('content-history')
export class ContentHistoryController {
  constructor(private contentHistoryService: ContentHistoryService) {}

  // @UseGuards(AuthGuard)
  @Post()
  create(@Body() contentHistoryDto: ContentHistoryDto, @Request() req): any {
    // contentHistoryDto.userId = req?.user?.userId;
    console.log(req.user);
    return this.contentHistoryService.create(contentHistoryDto);
  }

  // @UseGuards(AuthGuard)
  @Get()
  getAllContentHistory(@Request() req): any {
    // console.log(req?.user?.userId);
    return this.contentHistoryService.findAll(req?.user?.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getContentHistoryById(@Param('id') id: number): any {
    return this.contentHistoryService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateContentHistoryDto: UpdateContentHistoryDto,
  ): any {
    return this.contentHistoryService.update(id, updateContentHistoryDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.contentHistoryService.delete(id);
  }

  // // @UseGuards(AuthGuard)
  // @Get('/category/list')
  // getAllContentCategory(): any {
  //   return this.contentHistoryService.findAllCategory();
  // }
}
