import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FileOperationsService } from '../file-operations/file-operations.service';
import { FileUploadRequest, PaginatedFiles } from './dto/file.dto';
import { FilesRepositoryProvider } from './repository/files.repository.provider';
import { filesWithTagsAndProviders } from './types/types';
import { FileObject } from '../file-operations/providers/operations.interface';
import { TagsRepositoryProvider } from './repository/tags.repository.provider';
import { Prisma } from '@prisma/client';

@Injectable()
export class FilesService {
  @Inject()
  private fileOperationsService: FileOperationsService;

  @Inject()
  private filesRepositoryProvider: FilesRepositoryProvider;

  @Inject()
  private tagsRepositoryProvider: TagsRepositoryProvider;

  staticInclude = {
    fileTags: { include: { tags: true } },
    providers: { select: { name: true } },
  };

  async uploadFile(
    file: Express.Multer.File,
    body: FileUploadRequest,
    apiKey: string,
  ) {
    const { tag } = body;

    const fileObject: FileObject = {
      name: `${file.originalname}`,
      buffer: file.buffer,
      mimeType: file.mimetype,
      tag,
    };

    const uploadedData = await this.fileOperationsService.uploadFile(
      fileObject,
    );
    const data = await this.filesRepositoryProvider.create({
      data: {
        name: fileObject.name,
        size: file.size,
        clients: {
          connect: {
            apiKey,
          },
        },
        providers: {
          connectOrCreate: {
            create: {
              name: uploadedData.provider,
              default: true,
            },
            where: {
              name: uploadedData.provider,
            },
          },
        },
        mimeType: fileObject.mimeType,
        objectKey: uploadedData.url,
        fileTags: {
          create: {
            tags: {
              connectOrCreate: {
                create: {
                  name: tag,
                },
                where: {
                  name: tag,
                },
              },
            },
          },
        },
      },
    });
    return this.getFile(data.id);
  }

  async updateFile(
    id: number,
    file: Express.Multer.File,
    body: FileUploadRequest,
    apiKey: string,
  ) {
    const { tag } = body;
    const fileObject: FileObject = {
      name: `${file.originalname}`,
      buffer: file.buffer,
      mimeType: file.mimetype,
      tag,
    };
    const uploadedData = await this.fileOperationsService.uploadFile(
      fileObject,
    );

    const data = await this.filesRepositoryProvider.update({
      where: { id: id, clients: { apiKey } },
      data: {
        name: fileObject.name,
        size: file.size,
        providers: {
          connectOrCreate: {
            create: {
              name: uploadedData.provider,
              default: true,
            },
            where: {
              name: uploadedData.provider,
            },
          },
        },
        clients: {
          connect: {
            apiKey,
          },
        },
        mimeType: fileObject.mimeType,
        objectKey: uploadedData.url,
        fileTags: {
          connectOrCreate: {
            where: {
              id: id,
            },
            create: {
              tags: {
                connectOrCreate: {
                  create: {
                    name: tag,
                  },
                  where: {
                    name: tag,
                  },
                },
              },
            },
          },
        },
      },
      include: this.staticInclude,
    });
    return data;
  }

  async deleteFile(
    id: number,
    force: boolean,
    apiKey: string,
  ): Promise<boolean> {
    const isForceDelete = force;
    try {
      if (isForceDelete) {
        const deletedObject: filesWithTagsAndProviders =
          (await this.filesRepositoryProvider.delete({
            where: { id: id, clients: { apiKey } },
            include: this.staticInclude,
          })) as filesWithTagsAndProviders;

        deletedObject.fileTags.forEach(async (fileTag) => {
          const tag = await this.tagsRepositoryProvider.findOneById({
            where: { id: fileTag.tagId },
          });

          await this.fileOperationsService.deleteFile({
            name: deletedObject.name,
            tag: tag.name,
          });
        });
      } else {
        await this.filesRepositoryProvider.update({
          where: { id: id, clients: { apiKey } },
          data: {
            deleted: true,
          },
        });
      }
    } catch (error) {
      if (error.message.includes('does not exist')) {
        throw new NotFoundException("File doesn't exist");
      }
    }
    return true;
  }

  async getFile(
    id: number,
    includeDeleted = false,
    apiKey?: string,
  ): Promise<filesWithTagsAndProviders> {
    const whereQuery: Prisma.filesWhereUniqueInput = includeDeleted
      ? { id, clients: { apiKey } }
      : { id, clients: { apiKey }, deleted: false };
    const file = await this.filesRepositoryProvider.findOneById({
      where: whereQuery,
      include: this.staticInclude,
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file as filesWithTagsAndProviders;
  }

  async getFiles(
    tag: string,
    size = 10,
    page = 0,
    provider: string,
    includeDeleted = false,
    apiKey?: string,
  ): Promise<PaginatedFiles> {
    const whereQuery: Prisma.filesWhereInput = includeDeleted
      ? {
          fileTags: { every: { tags: { name: tag } } },
          providers: { name: provider },
          clients: { apiKey },
        }
      : {
          fileTags: { every: { tags: { name: tag } } },
          providers: { name: provider },
          deleted: false,
          clients: { apiKey },
        };

    const files = await this.filesRepositoryProvider.findByQuery({
      where: whereQuery,
      include: this.staticInclude,
      orderBy: { createdAt: 'desc' },
      take: size,
      skip: page * size,
    });

    const totalCount = await this.filesRepositoryProvider.getTotalCount({
      where: whereQuery,
    });

    return {
      data: files as filesWithTagsAndProviders[],
      total: totalCount,
      page: page,
      limit: files.length,
    };
  }
}
