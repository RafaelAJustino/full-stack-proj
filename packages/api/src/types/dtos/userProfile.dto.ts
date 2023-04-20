/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUppercase, Length, MaxLength, MinLength } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @ApiProperty()
  id?: number | null;

  @IsOptional()
  @ApiProperty()
  userId?: number | null;

  @IsString()
  @ApiProperty()
  @Length(4, 80)
  email?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(80)
  @ApiProperty()
  password?: string;

  @Length(2, 50)
  @ApiProperty()
  firstName?: string;

  @Length(2, 50)
  @ApiProperty()
  lastName?: string;
  @MinLength(14)
  @MaxLength(15)
  @ApiProperty()
  phone?: string;

  @Length(4, 256)
  @ApiProperty()
  address?: string;

  @Length(2)
  @IsUppercase()
  @ApiProperty()
  state?: string;

  @Length(2, 100)
  @ApiProperty()
  city?: string;

  @Length(8)
  @ApiProperty()
  zipCode?: string;

  @IsOptional()
  @Length(0, 512)
  @ApiProperty()
  about?: string | null;

  @Length(0, 11)
  @ApiProperty()
  cpf?: string;

  @ApiProperty()
  avatarImg?: string;

  @ApiProperty()
  permissionId?: number;

  @ApiProperty()
  accessProfileId?: any;

  @ApiProperty()
  isActive?: boolean;
}
