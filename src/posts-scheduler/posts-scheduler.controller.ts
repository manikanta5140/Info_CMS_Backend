import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostsSchedulerService } from './posts-scheduler.service';

@Controller('schedule-posts')
export class PostsSchedulerController {
  constructor(private readonly postSchedulerService: PostsSchedulerService) {}
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async schedulePost(
    @Req() req,
    @Body('platformIds') platformIds: number[],
    @Body('postId') postId: number,
    @Body('scheduledDate') scheduledDate: string,
    @Body('scheduledTime') scheduledTime: string,
  ) {
    try {
      return this.postSchedulerService.schedulePost(
        req.user.userId,
        platformIds,
        postId,
        scheduledDate,
        scheduledTime,
      );
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Failed to schedule post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
