import { ApiProperty } from '@nestjs/swagger';

export class HttpExceptionResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}
