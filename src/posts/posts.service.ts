import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Posts } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { createPostDto } from './DTOs/createPost.dto';
import { PostedPlatforms } from './entities/posted-platforms.entity';
@Injectable()
export class PostsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,

    @InjectRepository(PostedPlatforms)
    private postedPlatformRepository: Repository<PostedPlatforms>,
  ) {}

  async createPost(postData: createPostDto, postImage?: Express.Multer.File) {
    let cloudinaryResponse: UploadApiResponse | UploadApiErrorResponse;
    let post: createPostDto = postData;
    try {
      if (postImage) {
        cloudinaryResponse = await this.cloudinaryService.uploadFile(postImage);
        post = this.postRepository.create({
          ...postData,
          imageUrl: cloudinaryResponse.secure_url,
        });
      }

      return this.postRepository.save(post);
    } catch (err) {
      if (cloudinaryResponse && !post) {
        this.cloudinaryService.deleteFile(cloudinaryResponse.public_id);
      }
      console.log(err);
      throw new BadRequestException();
    }
  }

  async getPosts(userId: number): Promise<any> {
    const [results, total] = await this.postRepository.findAndCount({
      where: { userId },
    });

    return {
      data: results,
    };
  }

  async findPostByUserIdAndContentHistoryId(
    userId: number,
    contentHistoryId: number,
  ) {
    return await this.postRepository.findOne({
      where: {
        userId,
        contentHistoryId,
      },
    });
  }

  async createPostOnPostedPaltform(
    userId: number,
    platformId: number,
    postId: number,
  ) {
    return await this.postedPlatformRepository.save({
      userId,
      platformId,
      postId,
    });
  }
}
