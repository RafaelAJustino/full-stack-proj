import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { uuid4 } from '@sentry/utils';
import { S3 } from 'aws-sdk';
import { UserUploadFolder } from '../../../types/enums/upload.enum';

@Injectable()
export class S3Service {
  private s3Sdk: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3Sdk = new S3({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      },
    });
  }

  async uploadFileToUserFolder(
    file: Express.Multer.File,
    folder: UserUploadFolder,
    user: Partial<User>,
  ) {
    const filename = `${uuid4()}.${(file.filename || file.originalname || '').split('.').pop()}`;

    const path = `uploads/${user?.id}/${folder}/${filename}`;

    return this.s3Sdk
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key: path,
        Body: file.buffer,
      })
      .promise();
  }
}
