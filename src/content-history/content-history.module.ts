import { Module } from '@nestjs/common';
import { ContentHistoryController } from './content-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentHistoryService } from './content-history.service';

@Module({

  imports: [TypeOrmModule.forFeature([])],
  providers: [ContentHistoryService],
  controllers: [ContentHistoryController],
  exports: [ContentHistoryService],
})
export class ContentHistoryModule { }
