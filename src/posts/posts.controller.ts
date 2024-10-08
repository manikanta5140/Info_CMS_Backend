import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { request } from 'http';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  @UseInterceptors(FileInterceptor('postImage'))
  async createPost(
    @Body() postData: any,
    @UploadedFile() postImage: Express.Multer.File,
  ) {
    try {
      const post = await this.postsService.createPost(postData, postImage);
      if (post) {
        return { status: 'success', post };
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllPosts(@Req() request): Promise<any> {
    return this.postsService.getPosts(request.user.userid);
  }

  @Get('all-platforms')
  async getAllPlatforms() {
    return this.postsService.getAllPlatform();
  }
}
