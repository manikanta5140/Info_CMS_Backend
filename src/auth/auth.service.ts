import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './DTOs/login.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async authenticate(data: LoginDto): Promise<any> {
    try {
      const user = await this.validateUser(data);
      if (!user) {
        console.log("in auth", user);
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
      throw new UnauthorizedException("Incorrect password !!");
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

  async sendVerificationMail(userDetails) {
    try {
      console.log(userDetails);
      const data = await this.signIn({ userId: userDetails.id });
      const response = await this.mailService.sendMail(
        userDetails.email,
        data.accessToken,
      );
      console.log(response);
    } catch (error) {
      return { status: 'Failed', message: error.message };
    }
  }
}
