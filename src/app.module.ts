import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { ContentHistoryService } from './content-history/content-history.service';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { ContentHistoryController } from './content-history/content-history.controller';
import { AuthService } from './auth/auth.service';
import { Users } from './users/entities/users.entity';
import { Platforms } from './posts/entities/platforms.entity';
import { Posts } from './posts/entities/posts.entity';
import { ContentHistory } from './content-history/entities/content-history.entity';
import { UserDetails } from './users/entities/user-details.entity';
import { JwtModule } from '@nestjs/jwt';
import { PostedPlatforms } from './posts/entities/posted-platforms.entity';
import { CloudinaryProvider } from './cloudinary/cloudinary';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { UserVerifiedPlatform } from './userVerifiedPlatforms/entity/user-verified-platform.entity';
import { UserSocialMediaCredential } from './social-medias/DTOs/user-social-media-credential.entity';
import { userVerifiedPlatformsController } from './userVerifiedPlatforms/userVerifiedPlatform.controller';
import { UserVerifiedPlatformsService } from './userVerifiedPlatforms/userVerifiedPlatform.service';
import { SocialMediaController } from './social-medias/social-medias.controller';
import { SocialMediasService } from './social-medias/social-medias.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ContentCategory } from './Content-category/entities/content-category.entity';
import { ContentCategoryController } from './Content-category/content-category.controller';
import { ContentCategoryService } from './Content-category/content-category.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsSchedulerService } from './common/jobs-scheduler.service';
import { PostsScheduler } from './posts-scheduler/entity/posts-scheduler.entity';
import { PostsSchedulerController } from './posts-scheduler/posts-scheduler.controller';
import { PostsSchedulerService } from './posts-scheduler/posts-scheduler.service';
// import { LoggerService } from './logger/logger.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [
          Users,
          UserDetails,
          ContentCategory,
          ContentHistory,
          Platforms,
          Posts,
          PostedPlatforms,
          UserVerifiedPlatform,
          UserSocialMediaCredential,
          PostsScheduler,
        ],
        synchronize: true,
      }),
    }),

    TypeOrmModule.forFeature([
      Users,
      ContentHistory,
      ContentCategory,
      Platforms,
      Posts,
      UserDetails,
      UserVerifiedPlatform,
      UserSocialMediaCredential,
      PostedPlatforms,
      PostsScheduler,
    ]),

    // JwtModule Configuration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
      }),
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    AuthController,
    ContentHistoryController,
    PostsController,
    UsersController,
    userVerifiedPlatformsController,
    SocialMediaController,
    ContentCategoryController,
    PostsSchedulerController,
  ],
  providers: [
    AppService,
    AuthService,
    ContentHistoryService,
    PostsService,
    UsersService,
    CloudinaryProvider,
    CloudinaryService,
    UserVerifiedPlatformsService,
    SocialMediasService,
    ContentCategoryService,
    JobsSchedulerService,
    PostsSchedulerService,
    // LoggerService
  ],
})
export class AppModule {}
