import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

interface ProductRepositoryProps {
  findMany(): Promise<Product[]>;
  findOne(slug: string): Promise<Product>;
  create(data: CreateProductDto): Promise<Product>;
  update(
    slug: string,
    data: UpdateProductDto,
  ): Promise<{
    message: string;
  }>;
  updateIsActive(slug: string): Promise<{
    message: string;
  }>;
  delete(slug: string): Promise<{
    message: string;
  }>;
}

@Injectable()
export class ProductRepository implements ProductRepositoryProps {
  constructor(private prisma: PrismaService) {}

  async findMany(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      include: {
        categories: true,
      },
    });
  }

  async findOne(slug: string): Promise<Product> {
    return await this.prisma.product.findUnique({ where: { slug } });
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (product) {
      throw new NotFoundException('product already exists');
    }

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

  async update(
    slug: string,
    data: UpdateProductDto,
  ): Promise<{
    message: string;
  }> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        categories: true,
      },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    if (data.slug !== product.slug) {
      const productSlug = await this.prisma.product.findUnique({
        where: { slug: data.slug },
        include: {
          categories: true,
        },
      });

      if (productSlug) {
        throw new NotFoundException('product already exists');
      }

      await this.prisma.product.update({
        where: {
          slug,
        },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          image: data.image,
          isActive: data.isActive,
          categories: {
            disconnect: product.categories.map((category: any) => ({
              slug: category.slug,
            })),
            connect: data.categories.map((slug) => ({
              slug,
            })),
          },
        },
      });

      return { message: 'Product updated successfully' };
    }

    await this.prisma.product.update({
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
          disconnect: product.categories.map((category: any) => ({
            slug: category.slug,
          })),
          connect: data.categories.map((slug) => ({
            slug,
          })),
        },
      },
    });

    return { message: 'Product updated successfully' };
  }

  async updateIsActive(slug: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    await this.prisma.product.update({
      where: { slug },
      data: {
        isActive: !product.isActive,
      },
    });

    return { message: 'Product updated successfully' };
  }

  async delete(slug: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    await this.prisma.product.delete({ where: { slug } });

    return { message: 'Product deleted successfully' };
  }
}
