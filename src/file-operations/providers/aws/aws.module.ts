import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const S3ClientProvider = {
  provide: 'S3',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new S3({
      credentials: {
        accessKeyId: config.get<string>('aws.key'),
        secretAccessKey: config.get<string>('aws.secret'),
      },
      endpoint: config.get<string>('aws.endpoint'),
      forcePathStyle: true,
    });
  },
};

@Module({
  providers: [AwsService, S3ClientProvider],
  exports: [AwsService],
})
export class AwsModule {}
