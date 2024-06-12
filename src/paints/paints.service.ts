import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paint } from './entities/paint.entity';
import { Model } from 'mongoose';
import { ListCreatePaintDto } from './dto/list-create-paint.dto';
import { ListDeletePaintDto } from './dto/list-delete-paint.dto';
import { ListUpdatePaintDto } from './dto/list-update-paint.dto';
import { UpdatePaintDto } from './dto/update-paint.dto';
import { UpdateDetailPaintDto } from './dto/update-detail-paint.dto';

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

  async list(page = 1, pageSize = 10, title = '', limit: number) {
    try {
      const skip = Number(pageSize) * (page - 1);
      const take = Number(limit) || Number(pageSize);

      const data = await this.paintModal
        .find({
          title: { $regex: title, $options: 'i' },
        })
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
        itemsPerPage: Number(take),
        totalItems,
        data,
      };
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.paintModal.findById(id);

      return { status: HttpStatus.OK, data };
    } catch (error) {
      throw error;
    }
  }

  async update(listUpdatePaintDto: ListUpdatePaintDto) {
    try {
      await Promise.all(
        listUpdatePaintDto.listPaints?.map(async (paint) => {
          try {
            const { _id, total_score, account_users_rate, ...newPaint } = paint;
            await this.paintModal.findByIdAndUpdate(_id, {
              $inc: {
                total_score: total_score || 0,
                account_users_rate: account_users_rate || 0,
              },
              ...newPaint,
            });
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

  async updatePaint(id: string, updateDetailPaintDto: UpdateDetailPaintDto) {
    try {
      const data = await this.paintModal.findByIdAndUpdate(
        id,
        updateDetailPaintDto,
        {
          new: true,
        },
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async views(id: string) {
    try {
      await this.paintModal.findByIdAndUpdate(id, { $inc: { views: 1 } });
      return 'add views successfully';
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
