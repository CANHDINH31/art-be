import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paint } from './entities/paint.entity';
import { Model } from 'mongoose';
import { ListCreatePaintDto } from './dto/list-create-paint.dto';
import { ListDeletePaintDto } from './dto/list-delete-paint.dto';
import { ListUpdatePaintDto } from './dto/list-update-paint.dto';

@Injectable()
export class PaintsService {
  constructor(@InjectModel(Paint.name) private paintModal: Model<Paint>) {}
  async create(ListCreatePaintDto: ListCreatePaintDto) {
    try {
      await Promise.all(
        ListCreatePaintDto.listPaints?.map(async (paint) => {
          try {
            const createPaint = new this.paintModal(paint);
            await createPaint.save();
          } catch (error) {
            throw error;
          }
        }),
      );
      return {
        status: HttpStatus.CREATED,
        messgae: 'create paints successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async list(page = 1, pageSize = 10, title: string) {
    try {
      const skip = Number(pageSize) * (page - 1);
      const take = Number(pageSize);

      const data = await this.paintModal
        .find({ title: { $regex: title, $options: 'i' } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take);

      const totalItems = await this.paintModal
        .find({ title: { $regex: title, $options: 'i' } })
        .count();

      const totalPage = Math.ceil(totalItems / Number(pageSize));

      return {
        currentPage: Number(page),
        totalPage,
        itemsPerPage: Number(pageSize),
        totalItems,
        data,
      };
    } catch (err) {
      throw err;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} paint`;
  }

  async update(listUpdatePaintDto: ListUpdatePaintDto) {
    try {
      await Promise.all(
        listUpdatePaintDto.listPaints?.map(async (paint) => {
          try {
            const { _id, ...newPaint } = paint;
            await this.paintModal.findByIdAndUpdate(_id, newPaint);
          } catch (error) {
            throw error;
          }
        }),
      );
      return {
        status: HttpStatus.CREATED,
        messgae: 'update paints successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(listDeletePaintDto: ListDeletePaintDto) {
    try {
      await this.paintModal.deleteMany({
        _id: { $in: listDeletePaintDto.listIdDelete },
      });
      return {
        status: HttpStatus.OK,
        message: 'Delete paints successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
