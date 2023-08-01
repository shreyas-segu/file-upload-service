import { Module } from '@nestjs/common';
import { LocalFsModule } from './local-fs/local-fs.module';
import { AwsModule } from './aws/aws.module';
import { ProviderFactoryService } from './provider-factory.service';

@Module({
  imports: [LocalFsModule, AwsModule],
  providers: [ProviderFactoryService],
  exports: [ProviderFactoryService],
})
export class ProvidersModule {}
