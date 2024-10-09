import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from './entities/user-details.entity';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SocialMediasService } from 'src/social-medias/social-medias.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,

    private readonly socialMediasService: SocialMediasService,
  ) {}

  async findAll(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<Users> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: { userDetails: true },
    });
  }

  async findById(id: number): Promise<Users> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: { userDetails: true },
    });
  }

  async create(userData: any): Promise<any> {
    const newUser = this.usersRepository.create(userData);
    return await this.usersRepository.save(newUser);
  }

  async createUserDetails(data: any): Promise<UserDetails> {
    return await this.userDetailsRepository.save(data);
  }

  async update(id: number, updatedUser: Partial<Users>): Promise<any> {
    console.log(updatedUser);
    return await this.usersRepository.update(id, updatedUser);
  }

  async updateUserDetails(
    id: number,
    updatedUser: Partial<UserDetails>,
    profilePhoto?: Express.Multer.File,
  ) {
    if (profilePhoto) {
      let cloudinaryResponse: UploadApiResponse | UploadApiErrorResponse;
      cloudinaryResponse =
        await this.cloudinaryService.uploadFile(profilePhoto);
      console.log(cloudinaryResponse);
      updatedUser = {
        ...updatedUser,
        profilePhoto: cloudinaryResponse.secure_url,
      };
    }
    await this.userDetailsRepository.update({ userId: id }, updatedUser);
    return await this.userDetailsRepository.findOne({ where: { userId: id } });
  }

  async isUniqueUserName(userName: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { userName } });
      if (!user) {
        return { isUnique: true };
      } else {
        return { isUnique: false };
      }
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException();
    }
  }

  async verifyUserPhoneNumber(mobileNumber: string, userId: number) {
    try {
      let OTP = this.randomSixDigitCode();
      const message = `Your verification code is ${OTP}. Please enter this code in the app to verify your account.`;
      this.socialMediasService.sendWhatsAppMessage(mobileNumber, message);
      await this.userDetailsRepository.update(
        { userId },
        { mobileNumberVerificationCode: OTP },
      );
      return { status: 'success' };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  randomSixDigitCode() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }
}
