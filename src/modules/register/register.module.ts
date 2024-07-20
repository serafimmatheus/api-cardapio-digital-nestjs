import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterRepository } from './entities/register.entity';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService, PrismaService, RegisterRepository],
})
export class RegisterModule {}
