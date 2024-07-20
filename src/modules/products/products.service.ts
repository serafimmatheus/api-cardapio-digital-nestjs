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

  update(slug: string, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
    return `This action updates a #${slug} product`;
  }

  remove(slug: string) {
    return `This action removes a #${slug} product`;
  }
}
