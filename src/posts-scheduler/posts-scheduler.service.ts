import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { PostsScheduler } from './entity/posts-scheduler.entity';
import { Users } from 'src/users/entities/users.entity';
import { Platforms } from 'src/posts/entities/platforms.entity';
import { Posts } from 'src/posts/entities/posts.entity';
import { SocialMediasService } from 'src/social-medias/social-medias.service';
import { scheduled } from 'rxjs';

@Injectable()
export class PostsSchedulerService {
  constructor(
    @InjectRepository(PostsScheduler)
    private postsSchedulerRepository: Repository<PostsScheduler>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Platforms)
    private platformsRepository: Repository<Platforms>,
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,

    private readonly socialMediasSerive: SocialMediasService,
  ) {}

  async schedulePost(
    userId: number,
    platformIds: number[],
    contentHistoryId: number,
    scheduledDate: string,
    scheduledTime: string,
  ) {
    try {
      const savePromises = platformIds.map((platformId) => {
        return this.postsSchedulerRepository.save({
          userId,
          platformId,
          contentHistoryId,
          scheduledDate,
          scheduledTime,
        });
      });
      await Promise.all(savePromises);

      return { status: 'success', message: 'scheduled successfully' };
    } catch (err) {
      throw new Error();
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleScheduledPosts() {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    console.log(currentTime, currentHours, currentMinutes);
    const scheduledPosts = await this.postsSchedulerRepository.find({
      where: {
        scheduledDate: currentTime.toISOString().split('T')[0],
        scheduledTime: `${currentHours}:${currentMinutes}`,
      },
      relations: ['users', 'platforms', 'contentHistory'],
    });

    console.log(scheduledPosts);

    for (const schedule of scheduledPosts) {
      const { users, platforms, contentHistory } = schedule;

      switch (platforms.platformName) {
        case 'Twitter': {
          const message = contentHistory.content.slice(0, 50);
          this.socialMediasSerive
            .postTwitterTweetOnBehalfOfUser(
              message,
              users.id,
              contentHistory.id,
            )
            .then(() => {})
            .catch((err) => console.error(err));
        }

        case 'Facebook': {
        }
      }
    }
  }
}
