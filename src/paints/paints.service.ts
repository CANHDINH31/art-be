import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdatePaintDto } from './dto/update-paint.dto';
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

  findAll() {
    return `This action returns all paints`;
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
