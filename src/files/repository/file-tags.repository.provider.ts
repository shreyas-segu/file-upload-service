import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, fileTags } from '@prisma/client';

@Injectable()
export class FileTagsRepositoryProvider {
  @Inject()
  private readonly prismaService: PrismaService;

  async findOneById(query: Prisma.fileTagsFindUniqueArgs): Promise<fileTags> {
    return this.prismaService.fileTags.findUnique(query);
  }

  async findByQuery(query: Prisma.fileTagsFindManyArgs): Promise<fileTags[]> {
    return this.prismaService.fileTags.findMany(query);
  }

  async create(data: Prisma.fileTagsCreateArgs): Promise<fileTags> {
    return this.prismaService.fileTags.create(data);
  }

  async update(data: Prisma.fileTagsUpdateArgs): Promise<fileTags> {
    return this.prismaService.fileTags.update(data);
  }

  async delete(data: Prisma.fileTagsDeleteArgs): Promise<fileTags> {
    return this.prismaService.fileTags.delete(data);
  }
}
