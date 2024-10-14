import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TwitterApi } from 'twitter-api-v2';
import { UserSocialMediaCredential } from './DTOs/user-social-media-credential.entity';
import { Repository } from 'typeorm';
import { Platforms } from '../posts/entities/platforms.entity';
import { UserVerifiedPlatform } from '../userVerifiedPlatforms/entity/user-verified-platform.entity';
import { Posts } from '../posts/entities/posts.entity';
import { PostsService } from '../posts/posts.service';
import * as Twilio from 'twilio';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SocialMediasService {
  private client: TwitterApi;
  private twilioClient: Twilio.Twilio;

  constructor(
    private readonly postsService: PostsService,
    private readonly httpService: HttpService,

    @InjectRepository(UserSocialMediaCredential)
    private userSocialMediaCredential: Repository<UserSocialMediaCredential>,

    @InjectRepository(Platforms)
    private platformRepository: Repository<Platforms>,

    @InjectRepository(UserVerifiedPlatform)
    private userVerifiedPlatformRepository: Repository<UserVerifiedPlatform>,

    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
  ) {
    this.client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    });

    this.twilioClient = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async getTwitterAuthorizationUrl(userId: number) {
    const { id } = await this.platformRepository.findOne({
      where: { platformName: 'Twitter' },
    });

    const redirectUri = new URL(process.env.REDIRECT_URI);
    redirectUri.searchParams.append('userId', userId.toString());
    redirectUri.searchParams.append('platformId', id.toString());

    const { url, codeVerifier, state } =
      await this.client.generateOAuth2AuthLink(redirectUri.toString(), {
        scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
      });

    console.log('code', codeVerifier);
    const existingCredential = await this.userSocialMediaCredential.findOne({
      where: { userId, platformId: id },
    });

    if (existingCredential) {
      existingCredential.verification_code = codeVerifier;
      await this.userSocialMediaCredential.save(existingCredential);
    } else {
      await this.userSocialMediaCredential.save({
        userId,
        platformId: id,
        verification_code: codeVerifier,
      });
    }
    console.log(url);
    return url;
  }

  async exchangeTwitterCodeForTokens(
    code: string,
    userId: number,
    platformId: number,
  ): Promise<any> {
    const { client } = this;
    const { verification_code } = await this.userSocialMediaCredential.findOne({
      where: { userId, platformId },
    });
    const codeVerifier = verification_code;

    const redirectUri = new URL(process.env.REDIRECT_URI);
    redirectUri.searchParams.append('userId', userId.toString());
    redirectUri.searchParams.append('platformId', platformId.toString());

    try {
      const { accessToken, refreshToken } = await client.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: redirectUri.toString(),
      });
      const existingCredential = await this.userSocialMediaCredential.findOne({
        where: { userId, platformId },
      });

      if (existingCredential) {
        existingCredential.access_token = accessToken;
        existingCredential.refresh_token = refreshToken;
        await this.userSocialMediaCredential.save(existingCredential);
        // const userVerification =
        //   await this.userVerifiedPlatformRepository.findOne({
        //     where: { userId, platformId },
        //   });
        // userVerification.isVerified = true;
        await this.userVerifiedPlatformRepository.save({
          userId,
          platformId,
          isVerified: true,
        });
      }
    } catch (error) {
      console.error('Error details:', error);
      throw new Error(`Failed to exchange code for tokens: ${error.message}`);
    }
  }

  async postTwitterTweetOnBehalfOfUser(
    tweet: string,
    userId: number,
    contentHistoryId: number,
  ): Promise<any> {
    try {
      const { id } = await this.platformRepository.findOne({
        where: { platformName: 'Twitter' },
      });
      const { access_token } = await this.userSocialMediaCredential.findOne({
        where: {
          userId,
          platformId: id,
        },
      });
      const userClient = new TwitterApi(access_token);
      const response = await userClient.v2.tweet(tweet);
      let post = await this.postsService.findPostByUserIdAndContentHistoryId(
        userId,
        contentHistoryId,
      );

      if (!post) {
        post = await this.postsService.createPost({
          userId,
          contentHistoryId,
        });
      }

      await this.postsService.createPostOnPostedPaltform(userId, id, post.id);

      return response;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to post tweet: ${error}`);
    }
  }

  async deleteTweet(tweetId: string): Promise<any> {
    try {
      const response = await this.client.v2.deleteTweet(tweetId);
      return response;
    } catch (error) {
      throw new Error(`Failed to delete tweet: ${error.message}`);
    }
  }

  async sendWhatsAppMessage(
    to: string,
    contentSid: string,
    contentVariables?: Record<string, string | number>,
  ) {
    try {
      const messagePayload: any = {
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+91${to}`,
        contentSid,
      };
      if (contentVariables) {
        messagePayload.contentVariables = JSON.stringify(contentVariables);
      }
      console.log(await this.twilioClient.messages.create(messagePayload));
      return;
    } catch (error) {
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
  }
  async saveFacebookCredentials(
    userId: number,
    appId: string,
    accessToken: string,
  ) {
    try {
      const platform = await this.platformRepository.findOne({
        where: { platformName: 'Facebook' },
      });
      const existingUserCredential =
        await this.userSocialMediaCredential.findOne({
          where: { userId, platformId: platform.id },
        });

      if (existingUserCredential) {
        existingUserCredential.verification_code = appId;
        existingUserCredential.access_token = accessToken;
        return await this.userSocialMediaCredential.save(existingUserCredential);
        
      } else {
        await this.userVerifiedPlatformRepository.save({
          userId,
          platformId: platform.id,
          isVerified: true,
        });
        return await this.userSocialMediaCredential.save({
          userId,
          platformId: platform.id,
          verification_code: appId,
          access_token: accessToken,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async findPlaformId(platformName: string): Promise<Platforms> {
    return await this.platformRepository.findOne({
      where: { platformName },
    });
  }

  async findSocialMediaCredentials(
    userId: number,
    platformId: number,
  ): Promise<UserSocialMediaCredential> {
    return await this.userSocialMediaCredential.findOne({
      where: {
        userId,
        platformId,
      },
    });
  }

  async postFacebookPost(
    message: string,
    userId: number,
    contentHistoryId: number,
  ){
    try {
      const { id } = await this.findPlaformId('Facebook');

      const { verification_code, access_token } =
        await this.findSocialMediaCredentials(
          userId,
          id,
        );
      console.log(verification_code,access_token,message);  
      const url = `https://graph.facebook.com/v21.0/${verification_code}/feed?message=${message}&access_token=${access_token}`;
      const response = await this.httpService.post(url).toPromise();
      console.log(response.data);
      if (response) {
        const post = await this.postsService.createPost({
          userId: userId,
          contentHistoryId,
        });
        await this.postsService.createPostOnPostedPaltform(
          userId,
          id,
          post.id,
        );
      }
      return { success: true, message: 'Post published successfully!' };
    } catch (error) {
      console.error('Error posting to Facebook:', error.message);
      return { success: false, message: 'Failed to publish post.' };
    }
  }
}
