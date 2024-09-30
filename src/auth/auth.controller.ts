import { BadRequestException, Body, Controller, Get, HttpStatus, Post, UseGuards, HttpCode, Param } from '@nestjs/common';
import { RegisterDto } from 'src/auth/DTOs/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { LoginDto } from './DTOs/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() registerDto: RegisterDto) {
    const { userName, email, password, firstName, lastName } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.authService.register(
      userName,
      email,
      hashedPassword,
      firstName,
      lastName
    );

    const { password: _, ...userWithoutPassword } = result;

    return { user: userWithoutPassword, message: 'User registered successfully' };
  }

  @HttpCode(HttpStatus.OK)
  @Get('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.authenticate(loginDto);
  }

    // @Get('verify/:token')
    // async get(@Param('token') token: string) {
    //   try {
    //     const tokenPayload = await this.jwtService.verifyAsync(token);
    //     const user = await this.usersService.findOne(tokenPayload.user);

    //     if (!user) {
    //       throw new BadRequestException('Invalid User !!');
    //     }
    //     user.isActive = true;
    //     const response = await this.userService.update(payload.id, user);
    //     delete response.password;
    //     return response;
    //   } catch (error) {
    //     return { status: 'Failed', message: error.message };
    //   }
    // }

  //   async userAuthentication(token: string) {
  //     try {
  //       const payload = jwt.verify(token, process.env.JWT_KEY);
  //       const user = await this.userService.findOne(payload.id);

  //       if (!user) {
  //         throw new BadRequestException('Invalid User !!');
  //       }
  //       delete user.password;
  //       return user;
  //     } catch (error) {
  //       return { status: 'Failed', message: error.message };
  //     }
  //   }

  //   async getUser(id: number) {
  //     try {
  //       return await this.userService.findOne(id);
  //     } catch (error) {
  //       return { status: 'Failed', message: error.message };
  //     }
  //   }
}
