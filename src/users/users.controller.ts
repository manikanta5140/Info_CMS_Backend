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
      const userDetail = await this.usersService.findById(req?.user?.userId);
      const { password: _, userDetails, ...userWithoutDetails } = userDetail;

      const combinedUserDetails = {
        ...userWithoutDetails,
        ...userDetails,
      };
      console.log(combinedUserDetails);
      return combinedUserDetails;
    } catch (error) {
      return { status: 'Failed', message: error.message };
    }
  }

  @Patch()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async updateUser(
    @Req() req:any,
    @Body() updateUserDetails: Partial<UserDetails>,
    @UploadedFile() profilePhoto: Express.Multer.File,
  ) {
    console.log(req.user.userId,
      updateUserDetails,
      profilePhoto,)
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
  async verifyUserPhoneNumber(
    @Req() req,
    @Body('mobileNumber') mobileNumber: string,
  ) {
    return await this.usersService.verifyUserPhoneNumber(
      mobileNumber,
      req.user.userId,
    );
  }
}
