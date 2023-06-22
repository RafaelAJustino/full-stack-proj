import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import JWTMiddleware from '../../middlewares/jwt.middleware';
import { ExternalModule } from '../external/external.module';
import { RedisService } from '../../config/redis';
import { AccessProfileController } from './controllers/accessProfile.controller';
import { AuthController } from './controllers/auth.controller';
import { PermissionController } from './controllers/permission.controller';
import { UploadController } from './controllers/upload.controller';
import { PublicUserController } from './controllers/user.controller';
import { AccessProfileService } from './services/accessProfile.service';

import { AuthService } from './services/auth.service';
import { PermissionService } from './services/permission.service';
import { UserService } from './services/user.service';
import { ProposalService } from './services/proposal.service';
import { PublicProposalController } from './controllers/proposal.controller';

const providers = [
  AuthService,
  UserService,
  PermissionService,
  AccessProfileService,
  ProposalService,
  RedisService,
];
const controllers = [
  PublicUserController,
  AuthController,
  UploadController,
  PermissionController,
  AccessProfileController,
  PublicProposalController,
];

@Module({
  imports: [ExternalModule],
  controllers: [...controllers],
  providers: [...providers],
  exports: [...providers],
})
export class PublicModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
      )
      .forRoutes(...controllers);
  }
}
