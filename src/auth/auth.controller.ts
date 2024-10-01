import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  HttpCode,
  Param,
  NotFoundException,
} from '@nestjs/common';
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
    private jwtService: JwtService,
  ) {}

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
      lastName,
    );

    // if (result) {
    //   this.authService.sendVerificationMail(result);
    // }

    return this.authService.signIn({
        userId: result?.id,
        userName: result?.userName,
        email: result?.email,
        isVerified: result?.isVerified});
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.authenticate(loginDto);
  }

  @Get('verify/:token')
  async verifyUser(@Param('token') token: string) {
    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      
      if (!tokenPayload || !tokenPayload.sub) {
        throw new BadRequestException('Invalid token!');
      }
      const user = await this.usersService.findById(tokenPayload.sub);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      if (user.isVerified) {
        return {
          status: HttpStatus.OK,
          message: 'User is already verified.',
        };
      }
      user.isVerified = true;
      await this.usersService.update(tokenPayload.sub, {isVerified: true});
      return {
        status: HttpStatus.OK,
        message: 'User verified successfully.',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while verifying the user.',
      };
    }
  }
}
