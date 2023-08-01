import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileOperations } from '../file-operations/file-operations.module';
import { PrismaService } from '../prisma.service';
import { FilesRepositoryProvider } from './repository/files.repository.provider';
import { FileTagsRepositoryProvider } from './repository/file-tags.repository.provider';
import { TagsRepositoryProvider } from './repository/tags.repository.provider';
import { AuthModule } from '../auth/auth.module';
import { ApiKeyMiddleware } from '../auth/verify.middleware';

@Module({
  providers: [
    FilesService,
    PrismaService,
    FilesRepositoryProvider,
    FileTagsRepositoryProvider,
    TagsRepositoryProvider,
  ],
  imports: [FileOperations, AuthModule],
  controllers: [FilesController],
})
export class FilesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).exclude('auth/register').forRoutes('*');
  }
}
