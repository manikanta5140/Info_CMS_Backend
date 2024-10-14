import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './DTOs/login.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { MailDto } from '../mail/DTOs/mail.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async authenticate(data: LoginDto): Promise<any> {
    try {
      const user = await this.validateUser(data);
      if (!user) {
        console.log('in auth', user);
        throw new UnauthorizedException();
      }
      return this.signIn(user);
    } catch (error) {
      throw error;
    }
  }

  async validateUser(data: LoginDto): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(data.email);
      if (!user) {
        throw new NotFoundException('User not found!!');
      }
      if (!user.isVerified) {
        throw new BadRequestException('Please verify to Login!!');
      }
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user?.password,
      );
      if (user && isPasswordValid) {
        return {
          userId: user?.id,
          userName: user?.userName,
          email: user?.email,
          profilePhoto: user?.userDetails?.profilePhoto,
          isVerified: user?.isVerified,
          isMobileVerified: user?.isMobileVerified
        };
      }
      throw new UnauthorizedException('Incorrect password !!');
    } catch (error) {
      throw error;
    }
  }

  async signIn(user: any): Promise<any> {
    const tokenPayload = {
      sub: user.userId,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);
    const { userId: _, ...userDetails } = user;
    return { accessToken, userDetails };
  }

  async register(
    userName: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    profilePhoto?: string,
    email_verified?: boolean,
  ): Promise<Users> {
    const user = await this.usersService.create({
      userName,
      email,
      password,
    });
    await this.usersService.update(user.id, { isVerified: email_verified });
    await this.usersService.createUserDetails({
      userId: user.id,
      firstName,
      lastName,
      profilePhoto,
    });
    const userRes = this.usersService.findById(user.id);
    return userRes;
  }

  async sendVerificationMail(user: Users) {
    try {
      const data = await this.signIn({ userId: user.id });

      const mailDto: MailDto = {
        from: 'mani@gmail.com',
        to: user.email,
        subject: 'Your account has been created',
        template: 'verify',
        context: {
          link: `http://localhost:8080/auth/verify-email/${data.accessToken}`,
        },
      };

      const response = await this.mailService.sendMail(mailDto);
      console.log('Mail response:', response);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }
}
