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
import { Users } from './users/users.entity';
import { Platforms } from './posts/platforms.entity';
import { Posts } from './posts/posts.entity';
import { ContentHistory } from './content-history/content-history.entity';
import { UserDetails } from './users/user-details.entity';
import { JwtModule } from '@nestjs/jwt';
import { PostedPlatforms } from './posts/posted-platforms.entity';
import { CloudinaryProvider } from './cloudinary/cloudinary';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { UserVerifiedPlatform } from './userVerifiedPlatforms/entity/user-verified-platform.entity';
import { UserSocialMediaCredential } from './social-medias/DTOs/user-social-media-credential.entity';
import { userVerifiedPlatformsController } from './userVerifiedPlatforms/userVerifiedPlatform.controller';
import { UserVerifiedPlatformsService } from './userVerifiedPlatforms/userVerifiedPlatform.service';
import { SocialMediaController } from './social-medias/social-medias.controller';
import { SocialMediasService } from './social-medias/social-medias.service';
import { MailService } from './mail/mail.service';
import { ContentCategory } from './Content-category/content-category.entity';
import { ContentCategoryController } from './Content-category/content-category.controller';
import { ContentCategoryService } from './Content-category/content-category.service';

@Module({
  imports: [
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
    MailService,
    ContentCategoryService,
  ],
})
export class AppModule {}
