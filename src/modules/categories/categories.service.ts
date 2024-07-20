import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private categoryRepo: CategoryRepository) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepo.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryRepo.findMany();
  }

  async findOne(slug: string) {
    return await this.categoryRepo.findOne(slug);
  }

  async update(slug: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepo.update(slug, updateCategoryDto);
  }

  async remove(slug: string) {
    return await this.categoryRepo.delete(slug);
  }
}
