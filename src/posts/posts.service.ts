import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Posts } from './posts.entity';
import { Repository } from 'typeorm';
import { createPostDto } from './DTOs/createPost.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
  ) {}

  async createPost(postData: createPostDto, postImage: Express.Multer.File) {
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

  async getPosts(
    page: number = 1,
    limit: number = 10,
    userId: number,
  ): Promise<any> {
    const [results, total] = await this.postRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
    });
    const lastPage = Math.ceil(total / limit);

    if (lastPage == 0) {
      return {
        status: 'Failed',
        message: `No posts found.`,
      };
    }

    if (page > lastPage) {
      return {
        status: 'Failed',
        message: `No more data beyond page ${lastPage} with limit ${limit}.`,
      };
    }

    return {
      data: results,
      currentPage: page,
      lastPage,
      total,
    };
  }
}
