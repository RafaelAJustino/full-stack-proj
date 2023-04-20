import { User } from './user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfile {
  @ApiProperty({ type: Number })
  id: number = undefined;

  @ApiProperty({ type: () => User })
  user: User = undefined;

  @ApiProperty({ type: Number })
  userId: number = undefined;

  @ApiPropertyOptional({ type: String })
  firstName?: string = undefined;

  @ApiPropertyOptional({ type: String })
  lastName?: string = undefined;

  @ApiPropertyOptional({ type: String })
  cpf?: string = undefined;

  @ApiPropertyOptional({ type: String })
  state?: string = undefined;

  @ApiPropertyOptional({ type: String })
  zipCode?: string = undefined;

  @ApiPropertyOptional({ type: String })
  city?: string = undefined;

  @ApiPropertyOptional({ type: String })
  address?: string = undefined;

  @ApiPropertyOptional({ type: String })
  about?: string = undefined;

  @ApiPropertyOptional({ type: String })
  avatarImg?: string = 'default_avatar.jpg';

  @ApiProperty({ type: Date })
  createdAt: Date = undefined;

  @ApiProperty({ type: Date })
  updatedAt: Date = undefined;
}
