import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async authenticate(input: any): Promise<any>{
    const user = await this.validateUser(input);
    console.log("auth",user);
    if(!user){
      throw new UnauthorizedException();
    }
    return this.signIn(user);
  }

  async validateUser(input: any): Promise<any>{
    const user = await this.usersService.findByEmail(input.email);
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if(user && isPasswordValid){
      return {
        userid: user.id,
        username: user.userName
      };
    }
    return null;
  }

  async signIn(user: any): Promise<any>{
    const tokenPayload = {
      sub: user.userid,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {accessToken, user};
  }

  async register(userName: string, email: string, password: string, firstName: string, lastName: string): Promise<Users> {
    // return this.userService.register(fullname, email, password, gender, dateOfBirth, profilePhoto);
    const user = await this.usersService.create({userName, email, password});
    const userDetails = await this.usersService.createUserDetails({userId:user.id, firstName, lastName});
    return user;
  }
}
