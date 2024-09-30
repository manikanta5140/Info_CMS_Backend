import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from 'src/users/DTOs/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

      @Post('register')
      async registerUser(@Body() registerDto: RegisterDto) {
        try {
          let { userName, email, password, firstName, lastName} = registerDto;
          if ([userName, email, password, firstName, lastName].some((field) => field?.trim() === '')) {
            throw new BadRequestException('All fields are required');
          }
    
          const existingUser = await this.usersService.findByEmail(email);
    
          if (existingUser) {
            throw new BadRequestException('User Already Exists');
          }
          password = await bcrypt.hash(password, 10);
          const result = await this.authService.register(
            userName,
            email,
            password,
            firstName,
            lastName
          );
          delete result.password;
          
          return { result};
        } catch (error) {
          return { status: 'Failed', message: error.message };
        }
      }

      @Post('login')
      login(@Body() body) {
        return this.authService.authenticate(body);
      }

      @UseGuards(AuthGuard)
      @Get('me')
      demo(){
        return "hi";
      }

      // @Get('login')
      // async login(@Body() body) {
      //   const { email, password } = body;
      //   try {
      //     const user = await this.usersService.findByEmail(email);
      //     if (!user) {
      //       throw new BadRequestException("User doesn't exists !!");
      //     }
    
      //   //   if (!user.isVerified) {
      //   //     throw new BadRequestException('User is not verified !!');
      //   //   }
    
      //     const isPasswordValid = await bcrypt.compare(password, user.password);
      //     if (!isPasswordValid) {
      //       throw new BadRequestException('Invalid password !!');
      //     }
    
      //     const token = this.authService.generateToken({
      //       id: user.id,
      //     });
    
      //     return { message: 'success', token };
      //   } catch (error) {
      //     return { status: 'Failed', message: error.message };
      //   }
      // }
    
    //   @Get('verify/:token')
    //   async get(@Param('token') token: string) {
    //     try {
    //       let payload = await jwt.verify(token, process.env.JWT_KEY);
    //       const user = await this.userService.findOne(payload.id);
    
    //       if (!user) {
    //         throw new BadRequestException('Invalid User !!');
    //       }
    //       user.isActive = true;
    //       const response = await this.userService.update(payload.id, user);
    //       delete response.password;
    //       return response;
    //     } catch (error) {
    //       return { status: 'Failed', message: error.message };
    //     }
    //   }
    
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
