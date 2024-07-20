import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async findMany() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await this.prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categories: {
          connect: data.categories.map((slug) => ({
            slug,
          })),
        },
        price: data.price,
        image: data.image,
        isActive: data.isActive,
      },
    });
  }

  async update(slug: string, data: any) {
    return this.prisma.product.update({
      where: {
        slug,
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        isActive: data.isActive,
        categories: {
          disconnect: data.categories.map((category) => ({
            slug: category.slug,
          })),
          connect: data.categories.map((slug) => ({
            slug,
          })),
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
