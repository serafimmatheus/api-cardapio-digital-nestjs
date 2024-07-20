import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRepository } from './entities/auth.entity';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/env';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(configService: ConfigService<Env, true>) {
        return {
          secret: configService.get('JWT_SECRET', { infer: true }),
          signOptions: { expiresIn: '1d' },
          algorithms: ['HS256'],
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthRepository, JwtStrategy],
})
export class AuthModule {}
