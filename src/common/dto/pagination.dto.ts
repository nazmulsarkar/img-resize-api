import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Max(100)
  pageSize?: number = 100;

  @IsOptional()
  @Min(0)
  pageNumber?: number = 0;
}
