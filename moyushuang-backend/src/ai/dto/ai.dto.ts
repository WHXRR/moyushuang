import { IsString, IsOptional } from 'class-validator';

export class GenerateCatMessageDto {
  @IsOptional()
  @IsString()
  event?: string;
}