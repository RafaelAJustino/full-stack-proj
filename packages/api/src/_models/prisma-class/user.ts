import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserProfile } from './user_profile';
import { AccessProfileUser } from './access_profile_user';

export class User {
  @ApiProperty({ type: Number })
  id: number = undefined;

  @ApiProperty({ type: String })
  email: string = undefined;

  @ApiPropertyOptional({ type: String })
  phone?: string = undefined;

  @ApiProperty({ type: String })
  password: string = undefined;

  @ApiProperty({ type: Boolean })
  isActive = true;

  @ApiProperty({ type: Date })
  createdAt: Date = undefined;

  @ApiProperty({ type: Date })
  updatedAt: Date = undefined;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date = undefined;

  @ApiPropertyOptional({ type: () => UserProfile })
  profile?: UserProfile = undefined;

  @ApiProperty({ isArray: true, type: () => AccessProfileUser })
  accessProfileUser: AccessProfileUser[] = undefined;
}
