import { Module } from '@nestjs/common';
import { FileOperationsService } from './file-operations.service';
import { ProvidersModule } from './providers/providers.module';

@Module({
  providers: [FileOperationsService],
  imports: [ProvidersModule],
  exports: [FileOperationsService],
})
export class FileOperations {}
