import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { HttpExceptionResponse } from '../../../types/classes/error.class';
import { UploadImageDto } from '../../../types/dtos/upload.dto';
import { UserUploadFolder } from '../../../types/enums/upload.enum';
import { API_VERSION_HEADER, API_VERSIONS } from '../../../utils/consts';
import { S3Service } from '../../external/services/s3.service';

@ApiTags('Upload')
@ApiHeader({
  name: API_VERSION_HEADER,
  enum: API_VERSIONS,
  required: true,
})
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Usuário não autenticado',
  type: HttpExceptionResponse,
})
@Throttle()
@Controller({
  path: 'upload',
  version: API_VERSIONS,
})
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @Post('register')
  @ApiOperation({
    summary: 'Faz upload de uma imagem',
  })
  @ApiCreatedResponse({
    description: 'Imagem criada com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Erro ao fazer upload da imagem',
    type: HttpExceptionResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          enum: Object.values(UserUploadFolder),
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @Req() req: Request,
    @Body() model: UploadImageDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '(jpeg|jpg|png|gif|webp)$' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.s3Service.uploadFileToUserFolder(
      file,
      JSON.parse(model.folder),
      req.user,
    );
    return {
      path: result.Key,
    };
  }
}
