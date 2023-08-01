import { Test, TestingModule } from '@nestjs/testing';
import { AwsService } from './aws/aws.service';
import { LocalFsService } from './local-fs/local-fs.service';
import { ProviderFactoryService } from './provider-factory.service';
import { ConfigService } from '@nestjs/config';
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
describe('ProviderFactoryService', () => {
  let service: ProviderFactoryService;
  let awsService: AwsService;
  let localFsService: LocalFsService;

  const awsUploadFileMock = jest.fn();
  const awsDeleteFileMock = jest.fn();
  const localFsUploadFileMock = jest.fn();
  const localFsDeleteFileMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderFactoryService,
        LocalFsService,
        AwsService,
        ConfigService,
        {
          provide: 'S3',
          useClass: S3MockClient,
        },
      ],
    }).compile();

    service = module.get<ProviderFactoryService>(ProviderFactoryService);
    awsService = module.get<AwsService>(AwsService);
    localFsService = module.get<LocalFsService>(LocalFsService);

    jest.spyOn(awsService, 'uploadFile').mockImplementation(awsUploadFileMock);
    jest.spyOn(awsService, 'deleteFile').mockImplementation(awsDeleteFileMock);
    jest
      .spyOn(localFsService, 'uploadFile')
      .mockImplementation(localFsUploadFileMock);
    jest
      .spyOn(localFsService, 'deleteFile')
      .mockImplementation(localFsDeleteFileMock);

    awsUploadFileMock.mockReset();
    awsDeleteFileMock.mockReset();
    localFsUploadFileMock.mockReset();
    localFsDeleteFileMock.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should use S3s mock uploadFile method', async () => {
    const file: any = {
      tag: 'bucket-name',
      name: 'file-name.jpg',
      buffer: Buffer.from('file-content'),
      mimeType: 'image/jpeg',
    };

    const provider = service.getProvider(awsService.providerName);

    provider.uploadFile(file);

    expect(awsUploadFileMock).toHaveBeenCalledTimes(1);
    expect(localFsUploadFileMock).toHaveBeenCalledTimes(0);

    provider.deleteFile(file);

    expect(awsDeleteFileMock).toHaveBeenCalledTimes(1);
    expect(localFsDeleteFileMock).toHaveBeenCalledTimes(0);
  });

  it('should use LocalFSs mock uploadFile method', async () => {
    const file: any = {
      tag: 'bucket-name',
      name: 'file-name.jpg',
      buffer: Buffer.from('file-content'),
      mimeType: 'image/jpeg',
    };

    const provider = service.getProvider(localFsService.providerName);

    provider.uploadFile(file);

    expect(awsUploadFileMock).toHaveBeenCalledTimes(0);
    expect(localFsUploadFileMock).toHaveBeenCalledTimes(1);

    provider.deleteFile(file);

    expect(awsDeleteFileMock).toHaveBeenCalledTimes(0);
    expect(localFsDeleteFileMock).toHaveBeenCalledTimes(1);
  });
});
