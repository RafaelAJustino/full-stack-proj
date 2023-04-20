import { join } from 'path';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import express from 'express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { API_VERSION_HEADER, IGNORED_SENTRY_ERRORS } from './utils/consts';
import { PrismaModel } from './_models/prisma-class';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  app.enableCors({
    methods: '*',
    origin: '*',
  });

  const swaggerPath = '/docs';

  if (process.env.NODE_ENV === 'production') {
    app.use(
      swaggerPath,
      basicAuth({
        challenge: true,
        users: { ['temp']: 'hyperomegalul123' },
      }),
    );
  }

  app.use('/public', express.static(join(__dirname, '..', 'public')));

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: API_VERSION_HEADER,
    defaultVersion: '1',
  });

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({
        app: app.getHttpServer(),
      }),
      new Tracing.Integrations.Mysql(),
    ],
    tracesSampleRate: 0.85,
    environment: process.env.SENTRY_ENV,
    ignoreErrors: IGNORED_SENTRY_ERRORS,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(Sentry.Handlers.errorHandler());

  const config = new DocumentBuilder().setTitle('API').setVersion('0.0.1').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [...PrismaModel.extraModels],
  });

  SwaggerModule.setup(swaggerPath, app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Started with env ${process.env.APP_ENV} at http://localhost:${port}`);
}

bootstrap();
