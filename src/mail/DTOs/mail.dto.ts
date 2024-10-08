import { IsNotEmpty, IsOptional } from 'class-validator';

export class MailDto {
  @IsNotEmpty()
  receiverMail: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  template: string;

  @IsOptional()
  token?: string;

  @IsOptional()
  link?: string;
}
