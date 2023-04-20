import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from './user';
import { Permission } from './permission';

export class UserPermission {
  @ApiProperty({ type: Number })
  id: number = undefined;

  @ApiPropertyOptional({ type: () => User })
  user?: User = undefined;

  @ApiProperty({ type: Number })
  userId: number = undefined;

  @ApiPropertyOptional({ type: () => Permission })
  permission?: Permission = undefined;

  @ApiProperty({ type: Number })
  permissionId: number = undefined;

  @ApiProperty({ type: Date })
  createdAt: Date = undefined;

  @ApiProperty({ type: Date })
  updatedAt: Date = undefined;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date = undefined;
}
