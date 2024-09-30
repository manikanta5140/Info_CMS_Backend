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
        return { status: 'success' };
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      return { status: 'Failed', message: error.message };
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() request,
  ): Promise<{ data: any; total: number; page: number; lastPage: number }> {
    return this.postsService.getPosts(page, limit, request.user.userid);
  }
}
