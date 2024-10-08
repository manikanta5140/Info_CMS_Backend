import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Posts } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { createPostDto } from './DTOs/createPost.dto';
import { PostedPlatforms } from './entities/posted-platforms.entity';
import { Platforms } from './entities/platforms.entity';
@Injectable()
export class PostsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,

    @InjectRepository(PostedPlatforms)
    private postedPlatformRepository: Repository<PostedPlatforms>,

    @InjectRepository(Platforms)
    private platformRepository: Repository<Platforms>,
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
    const results = await this.postedPlatformRepository.find({
      where: { userId },
      relations: ['posts', 'posts.contentHistory', 'platforms'],
    });

    const groupedPosts = results.reduce((acc, current) => {
      const postId = current.postId;

      // If the postId doesn't exist in the accumulator, create a new entry
      if (!acc[postId]) {
        acc[postId] = {
          id: postId,
          userId: current.userId,
          platforms: [],
          posts: current.posts,
        };
      }

      acc[postId].platforms.push(current.platforms);

      return acc;
    }, {});

    return {
      data: Object.values(groupedPosts), // Convert the grouped object back to an array
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

  async getAllPlatform() {
    try {
      const result = await this.platformRepository.find();
      return {data:result}
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}
