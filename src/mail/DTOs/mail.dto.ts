import { IsNotEmpty, IsOptional } from 'class-validator';

export class MailDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  template: string;

  context: object;
}
