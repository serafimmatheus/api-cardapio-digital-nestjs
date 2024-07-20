import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from './entities/product.entity';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository, PrismaService],
})
export class ProductsModule {}
