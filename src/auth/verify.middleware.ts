import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header('X-API-Key');

    if (!apiKey) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const client = await this.authService.getClientByAPIKey(apiKey);

    if (!client) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  }
}
