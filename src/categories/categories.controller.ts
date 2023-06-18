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
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete()
  remove(@Body() listDeleteCategoryDto: ListDeleteCategoryDto) {
    return this.categoriesService.remove(listDeleteCategoryDto);
  }
}
