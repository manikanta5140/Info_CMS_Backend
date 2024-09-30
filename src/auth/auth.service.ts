import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './DTOs/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async authenticate(data: LoginDto): Promise<any>{
    const user = await this.validateUser(data);
    if(!user){
      throw new UnauthorizedException();
    }
    return this.signIn(user);
  }

  async validateUser(data: LoginDto): Promise<any>{
    const user = await this.usersService.findByEmail(data.email);
    // if(!user.isVerified){
    //   throw new BadRequestException('Please verify to Login !!');
    // }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if(user && isPasswordValid){
      return {
        userId: user?.id,
        userName: user?.userName,
        email: user?.email,
        profilePhoto: user?.userDetails?.profilePhoto
      };
    }
    return null;
  }

  async signIn(user: any): Promise<any>{
    const tokenPayload = {
      sub: user.userId
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);
    const { userId: _, ...userDetails } = user;
    return {accessToken, userDetails};
  }

  async register(userName: string, email: string, password: string, firstName: string, lastName: string): Promise<Users> {
    const user = await this.usersService.create({userName, email, password});
    const userDetails = await this.usersService.createUserDetails({userId:user.id, firstName, lastName});
    return user;
  }
}
