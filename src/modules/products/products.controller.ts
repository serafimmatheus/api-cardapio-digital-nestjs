import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, createProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '../pipes/pipes.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Products')
@UseGuards(AuthGuard('jwt'))
@Controller('/api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a products' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        slug: { type: 'string' },
        description: { type: 'string' },
        categories: { type: 'array', items: { type: 'string' } },
        price: { type: 'number' },
        image: { type: 'string' },
        isActive: { type: 'boolean' },
      },
    },
  })
  async create(
    @Body(new ZodValidationPipe(createProductDto)) body: CreateProductDto,
  ) {
    const { slug, name, price, categories, description, image, isActive } =
      body;

    const createProductDto = {
      slug,
      name,
      price,
      categories,
      description,
      image,
      isActive,
    };

    return await this.productsService.create(createProductDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all Products' })
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':slug')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one product by slug' })
  async findOne(@Param('slug') slug: string) {
    return await this.productsService.findOne(slug);
  }

  @Put(':slug')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update one product by slug' })
  update(@Param('slug') slug: string, @Body() body: UpdateProductDto) {
    const { ...updateProductDto } = body;
    return this.productsService.update(slug, updateProductDto);
  }

  @Delete(':slug')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete one product by slug' })
  remove(@Param('slug') slug: string) {
    return this.productsService.remove(slug);
  }
}
