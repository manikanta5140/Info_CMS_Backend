import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  HttpCode,
  Param,
  NotFoundException,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from '../auth/DTOs/register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { LoginDto } from './DTOs/login.dto';
import { JwtService } from '@nestjs/jwt';
// import { LoggerService } from 'src/logger/logger.service';

import { throwError } from 'rxjs';
import { join } from 'path';
import { AuthGuard } from './auth.guard';
import { LoggerService } from 'src/logger/logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly loggerService: LoggerService
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() registerDto: RegisterDto) {
    try {
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

      if (result) {
        this.authService.sendVerificationMail(result);
      }

      return this.authService.signIn({
        userId: result?.id,
        userName: result?.userName,
        email: result?.email,
        isVerified: result?.isVerified,
        isMobileVerified: result?.isMobileVerified,
        profilePhoto:
          'https://res.cloudinary.com/djyryzj1u/image/upload/v1728117185/aohrbick0qczyobxrhzv.webp',
      });
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.authenticate(loginDto);
    } catch (error) {
      console.log(error)
      this.loggerService.error(error,'AiBookController.getBooksBySubject()');
      throw error;
    }
  }

  @Get('verify-email/:token')
  async verifyUser(@Param('token') token: string, @Res() res) {
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
        return res.sendFile(join(__dirname, '..', '..', 'public', 'alreadyVerified.html'));

      }
      user.isVerified = true;
      await this.usersService.update(tokenPayload.sub, { isVerified: true });
      return res.sendFile(join(__dirname, '..', '..', 'public', 'verified.html'));

    } catch (error) {
      return res.sendFile(join(__dirname, '..', '..', 'public', 'failed.html'));
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('resend-email')
  async resentMail(@Request() req){
    try {
      const user = await this.usersService.findById(req?.user?.userId);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      this.authService.sendVerificationMail(user);
      return{
        message: 'resended succesfully !!'
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('isvalid-user/:token')
  async isValidUser(@Param('token') token: string) {
    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      if (!tokenPayload || !tokenPayload.sub) {
        throw new BadRequestException('Invalid token !!');
      }
      const user = await this.usersService.findById(tokenPayload.sub);
      if (!user?.isVerified) {
          throw new BadRequestException("User is not verified !!")
      }
      return {
        status: HttpStatus.OK,
        message: 'Valid User!!',
      };
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('store-google-user')
  async storeGoogleUser(@Body() googleUser: RegisterDto) {
    try {
      const {
        userName,
        email,
        password,
        firstName,
        lastName,
        profilePhoto,
        email_verified,
      } = googleUser;
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        return this.authService.signIn({
          userId: existingUser.id,
          userName: userName,
          email: email,
          isVerified: email_verified,
          profilePhoto: profilePhoto,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await this.authService.register(
        userName,
        email,
        hashedPassword,
        firstName,
        lastName,
        profilePhoto,
        email_verified,
      );
      // console.log(result);
      const photoRes = await this.usersService.findById(result?.id);
      console.log(photoRes);
      return this.authService.signIn({
        userId: result?.id,
        userName: result?.userName,
        email: result?.email,
        isVerified: result?.isVerified,
        profilePhoto: photoRes?.userDetails.profilePhoto,
      });
    } catch (error) {
      throw error;
    }
  }
}
