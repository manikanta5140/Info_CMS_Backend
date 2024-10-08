import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { AuthGuard } from '../auth/auth.guard';
import { UserVerifiedPlatformsService } from './userVerifiedPlatform.service';

@Controller('verifiedPlatforms')
export class userVerifiedPlatformsController {
  constructor(
    private readonly userVerifiedPlatformsService: UserVerifiedPlatformsService,
  ) {}
  @Get()
  @UseGuards(AuthGuard)
  async userVerifiedPlatforms(@Req() req) {
    try{
      return await this.userVerifiedPlatformsService.userVerifiedPlatforms(
        req?.user?.userId,
      );
    }catch(error){
      throw error;
    }
    
  }
}
