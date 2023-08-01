import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository.provider';
import { clients } from '@prisma/client';

@Injectable()
export class AuthService {
  @Inject()
  private readonly authRepository: AuthRepository;

  async registerClient(clientName: string): Promise<clients> {
    return await this.authRepository.register({
      data: { name: clientName, apiKey: this.generateApiKey(10) },
    });
  }

  async getClientByAPIKey(apiKey: string): Promise<clients> {
    return await this.authRepository.findOneByQuery({
      where: { apiKey: apiKey },
    });
  }

  private generateApiKey(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let apiKey = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      apiKey += charset[randomIndex];
    }

    return apiKey;
  }
}
