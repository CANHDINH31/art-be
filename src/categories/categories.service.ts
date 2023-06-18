import { HttpStatus, Injectable } from '@nestjs/common';
import { Category } from 'src/schemas/categories.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ListCreateCategoryDto } from './dto/list-create-category.dto';
import { ListDeleteCategoryDto } from './dto/list-delete-category.dto';
import { ListUpdateCategoryDto } from './dto/list-update-category.dto';
import mongoose, { Model } from 'mongoose';
import { ListToggleCategoryDto } from './dto/list-toggle-category.dto copy';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModal: Model<Category>,
  ) {}
  async create(listCreateCategoryDto: ListCreateCategoryDto) {
    try {
      await Promise.all(
        listCreateCategoryDto.listCategories?.map(async (category) => {
          try {
            const createCategory = new this.categoryModal(category);
            await createCategory.save();
          } catch (error) {
            throw error;
          }
        }),
      );
      return {
        status: HttpStatus.CREATED,
        messgae: 'create categories successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const listCategories = await this.categoryModal
        .find()
        .populate('list_paint_id');
      return {
        status: HttpStatus.OK,
        data: listCategories,
      };
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(listUpdateCategoryDto: ListUpdateCategoryDto) {
    try {
      await Promise.all(
        listUpdateCategoryDto.listCategories?.map(async (category) => {
          try {
            const { _id, ...newCategory } = category;
            await this.categoryModal.findByIdAndUpdate(_id, newCategory);
          } catch (error) {
            throw error;
          }
        }),
      );

      return {
        status: HttpStatus.CREATED,
        messgae: 'update categories successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async addToCategory(listUpdateCategoryDto: ListToggleCategoryDto) {
    try {
      await Promise.all(
        listUpdateCategoryDto.listCategories?.map(async (category) => {
          try {
            const foundCategory = await this.categoryModal.findById(
              category._id,
            );

            category?.list_paint_id?.forEach((id) => {
              if (!foundCategory.list_paint_id.includes(id)) {
                foundCategory.list_paint_id.push(id);
              }
            });

            await this.categoryModal.findByIdAndUpdate(
              category._id,
              foundCategory,
            );
          } catch (error) {
            throw error;
          }
        }),
      );

      return {
        status: HttpStatus.CREATED,
        messgae: 'add to categories successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async removeToCategory(listUpdateCategoryDto: ListToggleCategoryDto) {
    try {
      await Promise.all(
        listUpdateCategoryDto.listCategories?.map(async (category) => {
          try {
            const foundCategory = await this.categoryModal.findById(
              category._id,
            );

            foundCategory.list_paint_id = foundCategory?.list_paint_id?.filter(
              (id) => !category.list_paint_id.includes(id.toString()),
            );

            await this.categoryModal.findByIdAndUpdate(
              category._id,
              foundCategory,
            );
          } catch (error) {
            throw error;
          }
        }),
      );

      return {
        status: HttpStatus.CREATED,
        messgae: 'remove to categories successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(listDeleteCategoryDto: ListDeleteCategoryDto) {
    try {
      await this.categoryModal.deleteMany({
        _id: { $in: listDeleteCategoryDto.listIdDelete },
      });
      return {
        status: HttpStatus.OK,
        message: 'Delete categories successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
