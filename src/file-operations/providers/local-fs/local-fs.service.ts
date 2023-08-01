import { Injectable, Logger } from '@nestjs/common';
import {
  FileObject,
  FileOperationStatus,
  FileOperations,
} from '../operations.interface';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalFsService implements FileOperations {
  private readonly logger = new Logger(LocalFsService.name);

  constructor(private configService: ConfigService) {
    mkdir('uploads').catch((error) => {
      this.logger.error(error);
    });
  }

  providerName = 'local-fs';

  async uploadFile(file: FileObject): Promise<FileOperationStatus> {
    this.logger.log('Uploading file to local filesystem');
    const filePath = `uploads/${file.name}`;
    await writeFile(filePath, file.buffer);
    this.logger.log('File uploaded to local filesystem');
    // return true;
    return {
      status: true,
      url: `${this.configService.get('appURL')}/${file.name}`,
      metadata: { provider: this.providerName },
    };
  }

  async deleteFile(file: Partial<FileObject>): Promise<FileOperationStatus> {
    this.logger.log('Deleting file from local filesystem');
    const filePath = `uploads/${file.name}`;
    await unlink(filePath);
    this.logger.log('File deleted from local filesystem');
    return { status: true, metadata: { provider: this.providerName } };
  }
}
