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
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCreateCategoryDto } from './dto/list-create-category.dto';
import { ListDeleteCategoryDto } from './dto/list-delete-category.dto';
import { ListUpdateCategoryDto } from './dto/list-update-category.dto';
import { ListToggleCategoryDto } from './dto/list-toggle-category.dto copy';

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

  @Patch('add-to-category')
  addToCategory(@Body() listUpdateCategoryDto: ListToggleCategoryDto) {
    return this.categoriesService.addToCategory(listUpdateCategoryDto);
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
