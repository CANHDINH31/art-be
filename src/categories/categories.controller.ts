import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ListCreateCategoryDto } from './dto/list-create-category.dto';
import { ListDeleteCategoryDto } from './dto/list-delete-category.dto';
import { ListUpdateCategoryDto } from './dto/list-update-category.dto';
import { ListToggleCategoryDto } from './dto/list-toggle-category.dto copy';
import { AddToCategoryDto } from './dto/add-to-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() listCreateCategory: ListCreateCategoryDto) {
    return this.categoriesService.create(listCreateCategory);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get('/find-by-painting-id/:id')
  findByPaintingId(@Param('id') id: string) {
    return this.categoriesService.findByPaintingId(id);
  }

  @Patch('add-to-category')
  addToCategory(@Body() addToCategoryDto: AddToCategoryDto) {
    return this.categoriesService.addToCategory(addToCategoryDto);
  }

  @Patch('remove-to-category')
  removeToCategory(@Body() listUpdateCategoryDto: ListToggleCategoryDto) {
    return this.categoriesService.removeToCategory(listUpdateCategoryDto);
  }

  @Patch('')
  update(@Body() listUpdateCategoryDto: ListUpdateCategoryDto) {
    return this.categoriesService.update(listUpdateCategoryDto);
  }

  @Delete()
  remove(@Body() listDeleteCategoryDto: ListDeleteCategoryDto) {
    return this.categoriesService.remove(listDeleteCategoryDto);
  }
}
