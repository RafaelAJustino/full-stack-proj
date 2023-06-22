import { Proposal } from './proposal';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Client {
  @ApiProperty({ type: Number })
  id: number = undefined;

  @ApiProperty({ type: String })
  name: string = undefined;

  @ApiProperty({ type: String })
  contact: string = undefined;

  @ApiProperty({ type: String })
  document: string = undefined;

  @ApiProperty({ type: String })
  state: string = undefined;

  @ApiProperty({ type: String })
  zipCode: string = undefined;

  @ApiProperty({ type: String })
  city: string = undefined;

  @ApiProperty({ type: String })
  address: string = undefined;

  @ApiPropertyOptional({ type: String })
  avatarImg?: string = 'default_avatar.jpg';

  @ApiProperty({ type: Date })
  createdAt: Date = undefined;

  @ApiProperty({ type: Date })
  updatedAt: Date = undefined;

  @ApiProperty({ isArray: true, type: () => Proposal })
  Proposal: Proposal[] = undefined;
}
