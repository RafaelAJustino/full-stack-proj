import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginatedDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(100)
  perPage: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
