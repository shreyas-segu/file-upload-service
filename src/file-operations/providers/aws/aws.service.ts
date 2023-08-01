import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  FileObject,
  FileOperationStatus,
  FileOperations,
} from '../operations.interface';
import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService implements FileOperations {
  @Inject('S3')
  private S3: S3;

  @Inject()
  private configService: ConfigService;

  providerName = 's3';

  private readonly logger = new Logger(AwsService.name);

  async uploadFile(file: FileObject): Promise<FileOperationStatus> {
    try {
      this.logger.log('Uploading file to AWS S3');
      await this.S3.putObject({
        Bucket: file.tag,
        Key: file.name,
        Body: file.buffer,
        ContentType: file.mimeType,
        Tagging: file.tag,
      });
      this.logger.log('File uploaded to AWS S3');

      const url = `${this.configService.get('aws.endpoint')}/${file.tag}/${
        file.name
      }`;
      return { status: true, url, metadata: { provider: this.providerName } };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      return {
        status: false,
        metadata: { provider: this.providerName },
        errorMessage: error.message,
      };
    }
  }

  async deleteFile(file: FileObject): Promise<FileOperationStatus> {
    try {
      this.logger.log('Deleting file from AWS S3');
      await this.S3.deleteObject({
        Bucket: file.tag,
        Key: file.name,
      });
      this.logger.log('File deleted from AWS S3');

      const url = `${this.configService.get('aws.endpoint')}/${file.tag}/${
        file.name
      }`;

      return { status: true, url, metadata: { provider: this.providerName } };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      return {
        status: false,
        metadata: { provider: this.providerName },
        errorMessage: error.message,
      };
    }
  }
}
