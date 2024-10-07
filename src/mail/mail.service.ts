import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, token: string): Promise<void> {
    console.log('in sendmail', to, token);
    const mailOptions = {
      from: 'youremail@gmail.com',
      to: to,
      subject: 'Account created successfully !!',
      text: `click on the below link to verify !!!  link:http://localhost:8080/auth/verify-email/${token}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Mail sent successfully!');
    } catch (error) {
      throw new Error('Failed to send mail !!');
    }
  }
}
