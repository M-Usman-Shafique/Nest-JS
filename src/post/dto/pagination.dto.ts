import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @Min(0)
  @IsOptional()
  skip: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: number;
}
