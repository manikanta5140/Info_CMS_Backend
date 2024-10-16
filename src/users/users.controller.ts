import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Patch,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Post,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { Users } from './entities/users.entity';
import { UserDetails } from './entities/user-details.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { error } from 'console';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Request() req): Promise<any> {
    try {
      console.log(req?.user?.userId);
      const userDetail = await this.usersService.findById(req?.user?.userId);

      console.log(userDetail);
      const { password: _, userDetails, ...userWithoutDetails } = userDetail;

      const combinedUserDetails = {
        ...userWithoutDetails,
        ...userDetails,
      };
      console.log(combinedUserDetails);
      return combinedUserDetails;
    } catch (error) {
      console.log(error.message);
      return { status: 'Failed', message: error.message };
    }
  }

  @Patch()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async updateUser(
    @Req() req: any,
    @Body() updateUserDetails: Partial<UserDetails>,
    @UploadedFile() profilePhoto: Express.Multer.File,
  ) {
    console.log(req.user.userId, updateUserDetails, profilePhoto);
    try {
      const result = await this.usersService.updateUserDetails(
        req.user.userId,
        updateUserDetails,
        profilePhoto,
      );
      return result;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Post('unique-user')
  @HttpCode(200)
  async isUniqueUserName(@Body('userName') username: string) {
    return this.usersService.isUniqueUserName(username);
  }

  @Post('send-whatsapp-verification-token')
  @UseGuards(AuthGuard)
  async sendOtpOnUserPhoneNumber(
    @Req() req,
    @Body('mobileNumber') mobileNumber: string,
  ) {
    return await this.usersService.sendOtpOnUserPhoneNumber(
      mobileNumber,
      req.user.userId,
    );
  }

  @Post('verify-whatsapp-verification-token')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async verifyUsersWhatsappOtp(
    @Body('verificationCode') verificationCode: number,
    @Req() req,
  ) {
    return this.usersService.verifyUsersWhatsappOtp(
      req.user.userId,
      verificationCode,
    );
  }
}
