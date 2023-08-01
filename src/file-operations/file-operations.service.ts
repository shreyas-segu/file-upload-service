import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderFactoryService } from './providers/provider-factory.service';
import { FileObject, FileOperations } from './providers/operations.interface';

@Injectable()
export class FileOperationsService {
  private fileOperations: FileOperations;

  constructor(
    private providerFactory: ProviderFactoryService,
    private configService: ConfigService,
  ) {
    this.fileOperations = this.providerFactory.getProvider(
      this.configService.get('fileOperationsProvider'),
    );
  }

  async uploadFile(
    file: FileObject,
  ): Promise<{ url: string; provider: string }> {
    const data = await this.fileOperations.uploadFile({
      name: file.name,
      buffer: file.buffer,
      tag: file.tag,
      mimeType: file.mimeType,
    });

    return {
      url: encodeURI(data.url),
      provider: data.metadata.provider,
    };
  }

  async deleteFile(file: Partial<FileObject>): Promise<void> {
    await this.fileOperations.deleteFile({
      name: file.name,
      tag: file.tag,
    });
  }
}
