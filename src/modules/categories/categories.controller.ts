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
@Controller('/api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @Put(':slug/update')
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
  @UseGuards(AuthGuard('jwt'))
  @Put(':slug/toggle-category')
  async updateIsActive(@Param('slug') slug: string) {
    return await this.categoriesService.updateIsActive(slug);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':slug/delete')
  async remove(@Param('slug') slug: string) {
    return await this.categoriesService.remove(slug);
  }
}
