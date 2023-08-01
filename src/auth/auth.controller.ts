import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Post('register')
  @HttpCode(201)
  @ApiBody({ schema: { example: { clientName: 'string' } } })
  @ApiTags('Client Registration')
  async registerClient(
    @Body('clientName') clientName: string,
  ): Promise<{ apiKey: string }> {
    const client = await this.authService.registerClient(clientName);

    return { apiKey: client.apiKey };
  }
}
