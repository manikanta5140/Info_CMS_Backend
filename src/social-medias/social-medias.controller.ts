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
import { AuthGuard } from '../auth/auth.guard';
import { join } from 'path';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PostsService } from '../posts/posts.service';

@Controller('sm')
export class SocialMediaController {
  constructor(
    private readonly socialMediasService: SocialMediasService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly postsService: PostsService,
  ) {}

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
  async postTwitterTweet(
    @Body('message') message: string,
    @Req() req,
    @Body('contentHistoryId') contentHistoryId: number,
  ) {
    return this.socialMediasService.postTwitterTweetOnBehalfOfUser(
      message,
      req.user.userId,
      contentHistoryId,
    );
  }

  // @Post('send-whatsapp-message')
  // async sendWhatsAppMessage(
  //   @Body('to') to: string,
  //   @Body('message') message: string,
  // ) {
  //   return this.socialMediasService.sendWhatsAppMessage(to, message);
  // }

  @UseGuards(AuthGuard)
  @Post('facebook/credentials')
  async saveCredentials(@Body() body, @Req() req) {
    try {
      return await this.socialMediasService.saveFacebookCredentials(
        req?.user?.userId,
        body.appId,
        body.accessToken,
      ); 
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('facebook/post')
  async postFacebookPost(
    @Body('message') message: string,
    @Req() req,
    @Body('contentHistoryId') contentHistoryId: number, 
  ) {
    try {
      return this.socialMediasService.postFacebookPost(message,req?.user?.userId,contentHistoryId)
    } catch (error) {
      console.error('Error posting to Facebook:', error.message);
      return { success: false, message: 'Failed to publish post.' };
    }
  }
}
