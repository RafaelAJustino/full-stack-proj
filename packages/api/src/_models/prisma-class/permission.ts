import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionProfile } from './permission_profile';

export class Permission {
  @ApiProperty({ type: Number })
  id: number = undefined;

  @ApiProperty({ type: String })
  name: string = undefined;

  @ApiProperty({ type: String })
  description: string = undefined;

  @ApiProperty({ type: Date })
  createdAt: Date = undefined;

  @ApiProperty({ type: Date })
  updatedAt: Date = undefined;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date = undefined;

  @ApiProperty({ isArray: true, type: () => PermissionProfile })
  permissionProfile: PermissionProfile[] = undefined;
}
