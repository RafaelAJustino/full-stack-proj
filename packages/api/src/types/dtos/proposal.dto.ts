/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class ProposalDto {
  @IsOptional()
  @ApiProperty()
  id?: number;

  @Length(2, 50)
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @IsOptional()
  @ApiProperty()
  clientId?: any;
}
