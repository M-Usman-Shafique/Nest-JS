import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  image: string;
}
