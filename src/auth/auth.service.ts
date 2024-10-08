import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './DTOs/login.dto';
// import { MailService } from 'src/mail/mail.service';
import { MailDto } from 'src/mail/DTOs/mail.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    // private mailService: MailService,
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
      // if(!user.isVerified){
      //   throw new BadRequestException('Please verify to Login!!');
      // }
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
  ): Promise<Users> {
    const user = await this.usersService.create({ userName, email, password });
    await this.usersService.createUserDetails({
      userId: user.id,
      firstName,
      lastName,
    });
    return user;
  }

  async sendVerificationMail(user: Users) {
    try {
      const data = await this.signIn({ userId: user.id });
      const mailDto: MailDto = {
        receiverMail: user.email,
        subject: 'Your account has been created',
        template: 'verify',
        link: `http://localhost:8080/api/v1/auth/verify-email/${data.accessToken}`,
      };
      // const response = await this.mailService.sendMail(mailDto);
      // console.log(response);
    } catch (error) {
      return { status: 'Failed', message: error.message };
    }
  }
}
