import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findMany() {
    return await this.prisma.category.findMany();
  }

  async findOne(slug: string) {
    return await this.prisma.category.findUnique({ where: { slug } });
  }

  async create(data: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        isActive: data.isActive,
      },
    });
  }

  async update(slug: string, data: any) {
    return this.prisma.category.update({ where: { slug }, data });
  }

  async delete(slug: string) {
    return await this.prisma.category.delete({ where: { slug } });
  }
}
