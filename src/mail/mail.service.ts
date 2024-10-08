// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailService {
//     private transporter: nodemailer.Transporter
  
//   constructor(private configService: ConfigService) {
//     this.transporter = nodemailer.createTransport({
//       host: this.configService.get<string>('MAIL_HOST'),
//       port: this.configService.get<number>('MAIL_PORT'),
//       auth: {
//         user: this.configService.get<string>('MAIL_USER'),
//         pass: this.configService.get<string>('MAIL_PASS'),
//       },
//     });
//   }

//   async sendMail(to: string, token: string): Promise<void> {
//     console.log("in sendmail",to,token);
//     const mailOptions = {
//       from: 'youremail@gmail.com',
//       to: to,
//       subject: 'Account created successfully !!',
//       text: `click on the below link to verify !!!  link:http://localhost:8080/auth/verify/${token}`,
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//       console.log('Mail sent successfully!');
//     } catch (error) {
//       throw new Error('Failed to send mail !!');
//     }
//   }
// }
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { MailDto } from './DTOs/mail.dto';
import * as exphbs from 'express-handlebars'; // Import express-handlebars

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });

    // Dynamically import nodemailer-express-handlebars
    const hbs = (await import('nodemailer-express-handlebars')).default;

    // Instantiate express-handlebars
    const viewEngine = exphbs.create({
      extname: '.handlebars',
      partialsDir: join(__dirname, '../public/'),
      defaultLayout: false,
    });

    const handlebarOptions = {
      viewEngine, // Use the instance of express-handlebars
      viewPath: join(__dirname, '../public/'),
      extName: '.handlebars',
    };

    this.transporter.use('compile', hbs(handlebarOptions));
  }

  // async sendMail(to: string, token: string): Promise<void> {
  //   console.log('in sendmail', to, token);
  //   const mailOptions = {
  //     from: 'youremail@gmail.com',
  //     to: to,
  //     subject: 'Account created successfully !!',
  //     text: `click on the below link to verify !!!  link:http://localhost:8080/auth/verify-email/${token}`,
  async sendMail(mailDto: MailDto): Promise<void> {
    const mailOptions = {
      from: 'youremail@gmail.com',
      to: mailDto.receiverMail,
      subject: mailDto.subject,
      template: mailDto.template,
      context: {
        data: mailDto,
      },
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Mail sent successfully!');
    } catch (error) {
      console.error('Error sending mail:', error.message);
      throw new Error('Failed to send mail !!');
    }
  }
}
