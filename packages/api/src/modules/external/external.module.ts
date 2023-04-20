import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { S3Service } from './services/s3.service';

const providers = [PrismaService, S3Service];

@Module({
  imports: [],
  controllers: [],
  providers: providers,
  exports: providers,
})
export class ExternalModule {}
