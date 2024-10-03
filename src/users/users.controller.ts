import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Request() req) {
    try {
      const userDetail = await this.usersService.findById(req?.user?.userId);
      const { password: _, ...userWithoutPassword } = userDetail;
      console.log(userDetail);
      return userWithoutPassword;
    } catch (error) {
      return { status: 'Failed', message: error.message };
    }
  }
}
