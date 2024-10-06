import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SocialMediasService } from './social-medias.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { join } from 'path';

@Controller('sm')
export class SocialMediaController {
  constructor(private readonly socialMediasService: SocialMediasService) {}

  @Get('twitter/authorize')
  @UseGuards(AuthGuard)
  async twitterAuthorize(@Res() res: Response, @Req() req) {
    const redirectUrl =
      await this.socialMediasService.getTwitterAuthorizationUrl(
        req.user.userId,
      );
    console.log(redirectUrl, 'anup');
    return res.json({ redirectUrl });
  }

  @Get('twitter/callback')
  async handleTwitterCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('userId') userId: number,
    @Query('platformId') platformId: number,
    @Res() res: Response,
  ) {
    try {
      await this.socialMediasService.exchangeTwitterCodeForTokens(
        code,
        userId,
        platformId,
      );
      res.sendFile(join(__dirname, '..', '..', 'public', 'verified.html'));
    } catch (error) {
      console.error('Error exchanging code for tokens:', error.message);
      res.sendFile(join(__dirname, '..', '..', 'public', 'failed.html'));
    }
  }

  @Post('twitter/tweet')
  @UseGuards(AuthGuard)
  async postTwitterTweet(@Body('message') message: string, @Req() req) {
    console.log(message);
    console.log(req);
    return this.socialMediasService.postTwitterTweetOnBehalfOfUser(
      message,
      req.user.userId,
    );
  }
}
