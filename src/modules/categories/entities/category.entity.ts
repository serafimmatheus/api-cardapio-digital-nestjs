import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '@prisma/client';
import { UpdateCategoryDto } from '../dto/update-category.dto';

interface CategoryRepositoryProps {
  findMany(): Promise<Category[]>;
  findOne(slug: string): Promise<Category>;
}

@Injectable()
export class CategoryRepository implements CategoryRepositoryProps {
  constructor(private prisma: PrismaService) {}

  async findMany(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }

  async findOne(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { slug } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return await this.prisma.category.findUnique({ where: { slug } });
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (category) {
      throw new NotFoundException('Category already exists');
    }

    return await this.prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        isActive: data.isActive,
      },
    });
  }

  async update(slug: string, data: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (data.slug !== category.slug) {
      const categoryIsExists = await this.prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (categoryIsExists) {
        throw new NotFoundException('Category already exists');
      }

      await this.prisma.category.update({
        where: { slug },
        data: {
          name: data.name,
          isActive: data.isActive,
          slug: data.slug,
        },
      });

      return { message: 'Category updated successfully' };
    }

    await this.prisma.category.update({
      where: { slug },
      data: {
        name: data.name,
        isActive: data.isActive,
      },
    });

    return { message: 'Category updated successfully' };
  }

  async updateIsActive(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.prisma.category.update({
      where: { slug },
      data: {
        isActive: !category.isActive,
      },
    });

    return { message: 'Category updated successfully' };
  }

  async delete(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.prisma.category.delete({ where: { slug } });

    return { message: 'Category deleted successfully' };
  }
}
