import { Test, TestingModule } from '@nestjs/testing';
import { AwsService } from './aws.service';
import { ConfigService } from '@nestjs/config';

// We are not using the return from any of the S3 methods
export class S3MockClient {
  public putObject(params: any) {
    return {
      promise: () => Promise.resolve(),
    };
  }

  public deleteObject(params: any) {
    return {
      promise: () => Promise.resolve(),
    };
  }
}

describe('AwsService', () => {
  let service: AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsService,
        ConfigService,
        {
          provide: 'S3',
          useClass: S3MockClient,
        },
      ],
    }).compile();

    service = module.get<AwsService>(AwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload a file to AWS S3', async () => {
    const file: any = {
      tag: 'bucket-name',
      name: 'file-name.jpg',
      buffer: Buffer.from('file-content'),
      mimeType: 'image/jpeg',
    };

    const result = await service.uploadFile(file);

    expect(result.status).toBeTruthy();
    expect(result.url).toContain('bucket-name');
    expect(result.url).toContain('file-name.jpg');
    expect(result.metadata.provider).toBe('s3');
  });

  it('should delete a file from AWS S3', async () => {
    const file: any = {
      tag: 'bucket-name',
      name: 'file-name.jpg',
    };

    const result = await service.deleteFile(file);

    expect(result.status).toBeTruthy();
    expect(result.url).toContain('bucket-name');
    expect(result.url).toContain('file-name.jpg');
    expect(result.metadata.provider).toBe('s3');
  });

  it('should return an error status when an error occurs during upload', async () => {
    const file: any = {
      tag: 'bucket-name',
      name: 'file-name.jpg',
      buffer: Buffer.from('file-content'),
      mimeType: 'image/jpeg',
    };

    jest.spyOn(S3MockClient.prototype, 'putObject').mockImplementation(() => {
      throw new Error('Upload failed');
    });

    const result = await service.uploadFile(file);

    expect(result.status).toBeFalsy();
    expect(result.errorMessage).toBe('Upload failed');
    expect(result.metadata.provider).toBe('s3');
  });

  it('should return an error status when an error occurs during delete', async () => {
    const file: any = {
      tag: 'bucket-name',
      name: 'file-name.jpg',
    };

    jest
      .spyOn(S3MockClient.prototype, 'deleteObject')
      .mockImplementation(() => {
        throw new Error('Delete failed');
      });

    const result = await service.deleteFile(file);

    expect(result.status).toBeFalsy();
    expect(result.errorMessage).toBe('Delete failed');
    expect(result.metadata.provider).toBe('s3');
  });
});
