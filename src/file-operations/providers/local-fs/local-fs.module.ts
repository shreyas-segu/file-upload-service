import { Module } from '@nestjs/common';
import { LocalFsService } from './local-fs.service';

@Module({
  providers: [LocalFsService],
  imports: [],
  exports: [LocalFsService],
})
export class LocalFsModule {}
