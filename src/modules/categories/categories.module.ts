import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryRepository } from './entities/category.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, CategoryRepository],
})
export class CategoriesModule {}
