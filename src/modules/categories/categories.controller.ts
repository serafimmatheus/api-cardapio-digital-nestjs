/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '../pipes/pipes.service';
import {
  CreateCategoryDto,
  createCategoryDto,
} from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Categories')
@UseGuards(AuthGuard('jwt'))
@Controller('/api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a categories' })
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
        isActive: { type: 'boolean' },
      },
    },
  })
  async create(
    @Body(new ZodValidationPipe(createCategoryDto))
    createCategoryDto: CreateCategoryDto,
  ) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories.',
  })
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Get one category by slug' })
  @ApiResponse({
    status: 200,
    description: 'Return one category by slug.',
  })
  @ApiParam({
    name: 'slug',
    required: true,
    description: 'Category slug',
  })
  @ApiBearerAuth()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return await this.categoriesService.findOne(slug);
  }

  @ApiOperation({ summary: 'Update one category by slug' })
  @ApiResponse({
    status: 201,
    description: 'Return updated category.',
  })
  @ApiParam({
    name: 'slug',
    required: true,
    description: 'Category slug',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        slug: { type: 'string' },
        isActive: { type: 'boolean' },
      },
    },
  })
  @ApiBearerAuth()
  @Put(':slug')
  async update(
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(slug, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Update one category by slug' })
  @ApiResponse({
    status: 201,
    description: 'Return updated category.',
  })
  @ApiParam({
    name: 'slug',
    required: true,
    description: 'Category slug',
  })
  @ApiBearerAuth()
  @Put(':slug/toggle-category')
  async updateIsActive(@Param('slug') slug: string) {
    return await this.categoriesService.updateIsActive(slug);
  }

  @ApiBearerAuth()
  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    return await this.categoriesService.remove(slug);
  }
}
