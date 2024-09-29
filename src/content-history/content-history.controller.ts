import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { ContentHistoryDto } from './DTOs/content-history.dto';
import { ContentHistory } from './content-history.entity';
import { ContentHistoryService } from './content-history.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('content-history')
export class ContentHistoryController {
  constructor(
    private contentHistoryService: ContentHistoryService
  ){}
    
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() contentHistoryDto: ContentHistoryDto, @Request() req): any {
        contentHistoryDto.userId = req?.user?.userid;
        return this.contentHistoryService.create(contentHistoryDto);
      }

    @UseGuards(AuthGuard)  
    @Get()
    getAllContentHistory(@Request() req): any{
      console.log(req?.user?.userid);
      return this.contentHistoryService.findAll(req?.user?.userid);
    }
    
    //   @Get()
    //   async findAllWithRegistrations(@Query('emailId') emailId: string): Promise<Partial<Challenge>[]> {
    //     console.log(emailId,"EmailID");
    //     return this.challengeService.findAll(emailId);
    
    //     // const challenges = await this.challengeService.findAll();
    //     // return challenges.map(({ typeId,createdOn,modifiedOn, ...challenge }) => challenge);
    //   }
    
    //   @Get(':id')
    //   findOne(@Param('id') id: number): Promise<Challenge | null> {
    //     return this.challengeService.findOne(id);
    //   }
    
    //   @UseGuards(JwtAuthGuard,RolesGuard)
    //   @Put(':id')
    //   update(@Param('id') id: number, @Body() updateChallengeDto: UpdateChallengeDto): Promise<Challenge> {
    //     return this.challengeService.update(id, updateChallengeDto);
    //   }
    
    //   @UseGuards(JwtAuthGuard,RolesGuard)
    //   @Delete(':id')
    //   delete(@Param('id') id: number): Promise<void> {
    //     return this.challengeService.delete(id);
    //   }
}
