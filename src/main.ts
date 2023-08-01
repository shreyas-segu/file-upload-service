import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);

  const appName = configService.get<string>('appName');
  const appPort = configService.get<number>('port');
  const appURL = configService.get<string>('appURL');

  app.setGlobalPrefix(appName);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(
      'file-upload is a service for uploading files, any types of files can be uploaded and tagged for easy retrieval.',
    )
    .addServer(appURL)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(appPort);

  logger.log(`${appName} service is running on: ${appPort}`);
}
bootstrap();
