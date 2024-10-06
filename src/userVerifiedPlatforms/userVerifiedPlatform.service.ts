import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVerifiedPlatform } from './entity/user-verified-platform.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserVerifiedPlatformsService {
  constructor(
    @InjectRepository(UserVerifiedPlatform)
    private userVerifiedPlatformRepository: Repository<UserVerifiedPlatform>,
  ) {}
  async userVerifiedPlatforms(userId: number): Promise<UserVerifiedPlatform[]> {
    try {
      const verifiedPlatforms = this.userVerifiedPlatformRepository.find({
        where: {
          userId,
        },
        relations: { platforms: true },
      });
      return verifiedPlatforms;
    } catch (error) {
      throw error;
    }
  }
}
