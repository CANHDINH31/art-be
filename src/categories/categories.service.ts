import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/schemas/categories.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListCreateCategoryDto } from './dto/list-create-category.dto';
import { ListDeleteCategoryDto } from './dto/list-delete-category.dto';

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
      const listCategories = await this.categoryModal.find();
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

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
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
