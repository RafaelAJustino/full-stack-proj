import { AccessProfileUser } from './access_profile_user';
import { PermissionProfile } from './permission_profile';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccessProfile {
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

  @ApiProperty({ isArray: true, type: () => AccessProfileUser })
  accessProfileUser: AccessProfileUser[] = undefined;

  @ApiProperty({ isArray: true, type: () => PermissionProfile })
  permissionProfile: PermissionProfile[] = undefined;
}
