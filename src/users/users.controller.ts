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
import { AuthGuard } from 'src/auth/auth.guard';
import { Users } from './users.entity';
import { UserDetails } from './user-details.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Request() req): Promise<any> {
    try {
      const userDetail = await this.usersService.findById(req?.user?.userId);
      const { password: _, ...userWithoutPassword } = userDetail;
      console.log(userDetail);
      return userWithoutPassword;
    } catch (error) {
      return { status: 'Failed', message: error.message };
    }
  }

  @Patch()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async updateUser(
    @Req() req,
    @Body() updateUserDetails: Partial<UserDetails>,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    try {
      await this.usersService.updateUserDetails(
        req.user.userId,
        updateUserDetails,
        profileImage,
      );
      return { status: 'success', message: 'user updated successfully' };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Post('unique-user')
  @HttpCode(200)
  async isUniqueUserName(@Body('userName') username: string) {
    return this.usersService.isUniqueUserName(username);
  }
}
