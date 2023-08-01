import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repository/auth.repository.provider';
import { PrismaService } from '../prisma.service';
import { ApiKeyMiddleware } from './verify.middleware';

@Module({
  providers: [AuthService, AuthRepository, PrismaService, ApiKeyMiddleware],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
