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

@Controller('sm')
export class SocialMediaController {
  constructor(
    private readonly socialMediasService: SocialMediasService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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

@Post('facebook/credentials')
async saveCredentials(@Body() body, @Req() req) {
  try{
    await this.socialMediasService.saveFacebookCredentials(
      req.user.userId, 
      body.appId, 
      body.access_token
    );
  }catch(error){
    throw error;
  }
}


  // @Post('facebook/post')
  // async postFacebookPost(
  //   @Body('message') message: string,
  //   @Req() req,
  //   @Body('contentHistoryId') contentHistoryId: number,
  // ) {


  //   // const pageId = this.configService.get<string>('FACEBOOK_APP_ID'); 
  //   // const accessToken = this.configService.get<string>('FACEBOOK_ACCESS_TOKEN'); 
  //   // const url = `https://graph.facebook.com/v21.0/${pageId}/feed?message=${body.message}&access_token=${accessToken}`;

  //   try {
  //     const response = await this.httpService
  //       .post(
  //         url
  //       )
  //       .toPromise();
  //     console.log(response.data);
  //     return { success: true, message: 'Post published successfully!' };
  //   } catch (error) {
  //     console.error('Error posting to Facebook:', error.message);
  //     return { success: false, message: 'Failed to publish post.' };
  //   }
  // }
}
