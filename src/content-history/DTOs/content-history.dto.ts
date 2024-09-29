import { IsNumber, IsOptional } from "class-validator";

export class ContentHistoryDto{
  @IsNumber()
  @IsOptional()
  userId: number;
  
  categoryId: number;
  prompt: string;
  content: string;
}