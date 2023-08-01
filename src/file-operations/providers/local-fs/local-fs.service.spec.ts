import { Test, TestingModule } from '@nestjs/testing';
import { LocalFsService } from './local-fs.service';
import * as fsPromises from 'fs/promises';
import { ConfigService } from '@nestjs/config';

export const writeFileMock = jest.fn();
export const mkdirMock = jest.fn(() => Promise.resolve('success'));
export const unlinkMock = jest.fn();

export const promises = {
  writeFile: writeFileMock,
  mkdir: mkdirMock,
  unlink: unlinkMock,
};

describe('LocalFsService', () => {
  let service: LocalFsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalFsService, ConfigService],
    }).compile();

    service = module.get<LocalFsService>(LocalFsService);
    configService = module.get<ConfigService>(ConfigService);

    jest.spyOn(fsPromises, 'writeFile').mockImplementation(writeFileMock);
    jest.spyOn(fsPromises, 'mkdir').mockImplementation(mkdirMock);
    jest.spyOn(fsPromises, 'unlink').mockImplementation(unlinkMock);
    jest.spyOn(configService, 'get').mockReturnValue('http://localhost');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload a file to local filesystem', async () => {
    const file: any = {
      name: 'file-name.jpg',
      buffer: Buffer.from('file-content'),
    };

    const result = await service.uploadFile(file);

    expect(result.status).toBeTruthy();
    expect(result.url).toContain('http://localhost');
    expect(result.url).toContain('file-name.jpg');
    expect(result.metadata.provider).toBe('local-fs');
    expect(writeFileMock).toHaveBeenCalledWith(
      'uploads/file-name.jpg',
      Buffer.from('file-content'),
    );
  });

  it('should delete a file from local filesystem', async () => {
    const file: any = {
      name: 'file-name.jpg',
    };

    const result = await service.deleteFile(file);

    expect(result.status).toBeTruthy();
    expect(result.metadata.provider).toBe('local-fs');
    expect(unlinkMock).toHaveBeenCalledWith('uploads/file-name.jpg');
  });
});
