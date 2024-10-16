import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete
} from '@nestjs/common';
import { ContentHistoryDto } from './DTOs/content-history.dto';
import { ContentHistoryService } from './content-history.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateContentHistoryDto } from './DTOs/update-content-history.dto';
import { ContentHistory } from './entities/content-history.entity';
import { LoggerService } from 'src/logger/logger.service';

@Controller('content-history')
export class ContentHistoryController {
  constructor(
    private contentHistoryService: ContentHistoryService,
    private readonly loggerService: LoggerService
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() contentHistoryDto: ContentHistoryDto, @Request() req): Promise<ContentHistory> {
    try{
      contentHistoryDto.userId = req?.user?.userId;
      return await this.contentHistoryService.create(contentHistoryDto);
    }catch(error){
      this.loggerService.error(error,'ContentHistoryController.create()');
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  getAllContentHistory(@Request() req): any {
    console.log(req?.user?.userId);
    return this.contentHistoryService.findAll(req?.user?.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getContentHistoryById(@Param('id') id: number): Promise<ContentHistory> {
    try{
      return await this.contentHistoryService.findOne(id);
    }catch(error){
      throw error;
    }
   
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateContentHistoryDto: UpdateContentHistoryDto,
  ): Promise<ContentHistory> {
    try{
      return await this.contentHistoryService.update(id, updateContentHistoryDto);
    }catch(error){
      throw error;
    }
    
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    try{
      return await this.contentHistoryService.delete(id);
    }catch(error){
      throw error;
    }
    
  }

}
