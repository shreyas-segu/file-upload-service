import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, files } from '@prisma/client';

@Injectable()
export class FilesRepositoryProvider {
  @Inject()
  private readonly prismaService: PrismaService;

  async findOneById(query: Prisma.filesFindUniqueArgs): Promise<files> {
    return this.prismaService.files.findUnique(query);
  }

  async findByQuery(query: Prisma.filesFindManyArgs): Promise<files[]> {
    return this.prismaService.files.findMany(query);
  }

  async create(data: Prisma.filesCreateArgs): Promise<files> {
    return this.prismaService.files.create(data);
  }

  async update(data: Prisma.filesUpdateArgs): Promise<files> {
    return this.prismaService.files.update(data);
  }

  async delete(data: Prisma.filesDeleteArgs): Promise<files> {
    return this.prismaService.files.delete(data);
  }

  async getTotalCount(data: Prisma.filesCountArgs): Promise<number> {
    return this.prismaService.files.count(data);
  }
}
