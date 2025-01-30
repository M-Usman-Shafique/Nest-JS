import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  caption: string;

  @IsOptional()
  @IsString()
  image: string;
}
