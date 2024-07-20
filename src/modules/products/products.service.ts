import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private productRepo: ProductRepository) {}
  async create(createProductDto: CreateProductDto) {
    return await this.productRepo.create(createProductDto);
  }

  async findAll() {
    return await this.productRepo.findMany();
  }

  async findOne(slug: string) {
    return await this.productRepo.findOne(slug);
  }

  async update(slug: string, updateProductDto: UpdateProductDto) {
    return await this.productRepo.update(slug, updateProductDto);
  }

  async updateIsActive(slug: string) {
    return await this.productRepo.updateIsActive(slug);
  }

  async remove(slug: string) {
    return await this.productRepo.delete(slug);
  }
}
