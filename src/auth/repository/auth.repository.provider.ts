import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, clients } from '@prisma/client';

@Injectable()
export class AuthRepository {
  @Inject()
  private readonly prismaService: PrismaService;

  async register(data: Prisma.clientsCreateArgs): Promise<clients> {
    return await this.prismaService.clients.create(data);
  }

  async findOneByQuery(query: Prisma.clientsFindUniqueArgs): Promise<clients> {
    return await this.prismaService.clients.findUnique(query);
  }
}
