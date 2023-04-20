/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsLowercase,
  IsOptional,
  IsPhoneNumber,
  IsUppercase,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty()
  id?: number;

  @IsOptional()
  @IsEmail()
  @IsLowercase()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @Length(2, 50)
  @ApiProperty()
  firstName?: string;

  @IsOptional()
  @Length(2, 50)
  @ApiProperty()
  lastName?: string;

  @IsOptional()
  // @IsPhoneNumber('BR')
  @Length(2, 50)
  @ApiProperty()
  phone?: string;

  @IsOptional()
  @Length(4, 256)
  @ApiProperty()
  address?: string;

  @IsOptional()
  @Length(2, 50)
  @ApiProperty()
  country?: string;

  @IsOptional()
  @Length(2)
  @IsUppercase()
  @ApiProperty()
  state?: string;

  @IsOptional()
  @Length(2, 100)
  @ApiProperty()
  city?: string;

  @IsOptional()
  @Length(8)
  @ApiProperty()
  zipCode?: string;

  @IsOptional()
  @Length(0, 512)
  @ApiProperty()
  about?: string;

  @IsOptional()
  @Length(0, 11)
  @ApiProperty()
  cpf?: string;

  @IsOptional()
  @ApiProperty()
  avatarImg?: string;

  @IsOptional()
  @ApiProperty()
  accessProfileId?: any;

  @ApiProperty()
  isActive?: boolean;
}
