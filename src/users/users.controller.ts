import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUser(@Request() req) {
    try {
      const userDetail = await this.usersService.findById(req?.user?.userId);
      const { password: _, ...userWithoutPassword } = userDetail;
      return userWithoutPassword;
    } catch (error) {
      return { status: 'Failed', message: error.message };
    }
  }
}
