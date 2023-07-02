import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Permission } from './permission';
import { AccessProfile } from './access_profile';

export class PermissionProfile {
  @ApiProperty({ type: Number })
  id: number = undefined;

  @ApiPropertyOptional({ type: () => Permission })
  permission?: Permission = undefined;

  @ApiProperty({ type: Number })
  permissionId: number = undefined;

  @ApiPropertyOptional({ type: () => AccessProfile })
  accessProfile?: AccessProfile = undefined;

  @ApiProperty({ type: Number })
  accessProfileId: number = undefined;

  @ApiPropertyOptional({ type: Boolean })
  create?: boolean = undefined;

  @ApiPropertyOptional({ type: Boolean })
  update?: boolean = undefined;

  @ApiPropertyOptional({ type: Boolean })
  read?: boolean = undefined;

  @ApiPropertyOptional({ type: Boolean })
  delete?: boolean = undefined;

  @ApiProperty({ type: Date })
  createdAt: Date = undefined;

  @ApiProperty({ type: Date })
  updatedAt: Date = undefined;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date = undefined;
}
