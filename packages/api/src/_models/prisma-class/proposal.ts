import { Client } from './client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Proposal {
  @ApiProperty({ type: Number })
  id: number = undefined;

  @ApiPropertyOptional({ type: () => Client })
  client?: Client = undefined;

  @ApiProperty({ type: Number })
  clientId: number = undefined;

  @ApiProperty({ type: String })
  name: string = undefined;

  @ApiProperty({ type: String })
  type: string = 'LANDING_PAGE';

  @ApiProperty({ type: Date })
  createdAt: Date = undefined;

  @ApiProperty({ type: Date })
  updatedAt: Date = undefined;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date = undefined;
}
