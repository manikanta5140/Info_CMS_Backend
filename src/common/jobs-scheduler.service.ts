import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialMediasService } from 'src/social-medias/social-medias.service';
import { UserDetails } from 'src/users/entities/user-details.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobsSchedulerService {
  constructor(
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,

    private readonly socialMediasService: SocialMediasService,
  ) {}
  @Cron(CronExpression.EVERY_10_HOURS)
  async handleScheduledTask() {
    const userDetails = await this.userDetailsRepository
      .createQueryBuilder('userDetails')
      .innerJoinAndSelect('userDetails.users', 'users')
      .where('users.isMobileVerified = :isMobileVerified', {
        isMobileVerified: true,
      })
      .select(['userDetails.mobileNumber'])
      .getMany();

    userDetails.map((detail) =>
      this.socialMediasService.sendWhatsAppMessage(
        detail.mobileNumber,
        'HXbc9f20c611cad888b795a0d53cd7d387',
      ),
    );
  }
}
