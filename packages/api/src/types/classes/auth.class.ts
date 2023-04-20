/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  token: string;
}

export class AuthLoginResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  token: string;

  @ApiProperty()
  permission?: any;
}
