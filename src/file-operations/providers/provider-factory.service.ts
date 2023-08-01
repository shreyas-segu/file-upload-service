import { Inject, Injectable } from '@nestjs/common';
import { FileOperations } from './operations.interface';
import { AwsService } from './aws/aws.service';
import { LocalFsService } from './local-fs/local-fs.service';

@Injectable()
export class ProviderFactoryService {
  @Inject()
  private awsService: AwsService;

  @Inject()
  private localFS: LocalFsService;

  getProvider(providerName: string): FileOperations {
    const providerMap = new Map<string, FileOperations>();
    providerMap.set(this.awsService.providerName, this.awsService);
    providerMap.set(this.localFS.providerName, this.localFS);

    const provider = providerMap.get(providerName.toLowerCase());
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    return provider;
  }
}
