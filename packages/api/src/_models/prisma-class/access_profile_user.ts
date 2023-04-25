import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccessProfile } from './access_profile';
import { User } from './user';

export class AccessProfileUser {
  @ApiProperty({ type: Number })
  id: number = undefined;

  @ApiPropertyOptional({ type: () => AccessProfile })
  accessProfile?: AccessProfile = undefined;

  @ApiProperty({ type: Number })
  accessProfileId: number = undefined;

  @ApiPropertyOptional({ type: () => User })
  user?: User = undefined;

  @ApiProperty({ type: Number })
  userId: number = undefined;

  @ApiProperty({ type: Date })
  createdAt: Date = undefined;

  @ApiProperty({ type: Date })
  updatedAt: Date = undefined;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date = undefined;
}
