import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserUploadFolder } from '../enums/upload.enum';

export class UploadImageDto {
  @ApiProperty()
  @IsString()
  folder: UserUploadFolder;
}
