import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  fantasyName: string;

  @ApiProperty()
  @IsString()
  municipalRegistration: string;

  @ApiProperty()
  @IsString()
  stateRegistration: string;

  @ApiProperty()
  @IsString()
  document: string;

  @ApiProperty()
  @IsBoolean()
  simpleOptIn: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatarImg?: string;

  @ApiProperty()
  @IsNumber()
  companySizeId: number;

  @ApiProperty()
  @IsNumber()
  legalNatureId: number;
}

export class UpdateCompanyDto extends CreateCompanyDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
