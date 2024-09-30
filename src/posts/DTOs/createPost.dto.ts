import { IsNotEmpty, IsNumber } from 'class-validator';

export class createPostDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  contentHistoryId: number;
}
