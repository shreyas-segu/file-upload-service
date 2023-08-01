import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, tags } from '@prisma/client';

@Injectable()
export class TagsRepositoryProvider {
  @Inject()
  private readonly prismaService: PrismaService;

  async findOneById(query: Prisma.tagsFindUniqueArgs): Promise<tags> {
    return this.prismaService.tags.findUnique(query);
  }

  async findByQuery(query: Prisma.tagsFindManyArgs): Promise<tags[]> {
    return this.prismaService.tags.findMany(query);
  }

  async create(data: Prisma.tagsCreateArgs): Promise<tags> {
    return this.prismaService.tags.create(data);
  }

  async update(data: Prisma.tagsUpdateArgs): Promise<tags> {
    return this.prismaService.tags.update(data);
  }

  async delete(data: Prisma.tagsDeleteArgs): Promise<tags> {
    return this.prismaService.tags.delete(data);
  }
}
