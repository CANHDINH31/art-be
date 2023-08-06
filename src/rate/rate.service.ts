import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rate } from 'src/schemas/rates.schema';
import { SyncRateDto } from './dto/sync-rate.dto';
import { ConditionRateDto } from './dto/condition-rate.dto';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

@Injectable()
export class RateService {
  constructor(@InjectModel(Rate.name) private rateModal: Model<Rate>) {}
  async sync(syncRateDto: SyncRateDto, userId: string) {
    try {
      const existedRate = await this.findOne({
        ...syncRateDto,
        user_id: userId,
      });
      if (existedRate) {
        return await this.update({
          ...syncRateDto,
          user_id: userId,
          _id: existedRate._id.toString(),
        });
      } else {
        return await this.create({ ...syncRateDto, user_id: userId });
      }
    } catch (error) {
      throw error;
    }
  }

  async findOne(conditionRateDto: ConditionRateDto) {
    try {
      const foundRate = await this.rateModal.findOne({
        paint_id: conditionRateDto.paint_id,
        user_id: conditionRateDto.user_id,
      });
      return foundRate;
    } catch (error) {
      throw error;
    }
  }

  async findMany(paintId: string) {
    try {
      const foundRate = await this.rateModal.find({
        paint_id: paintId,
      });
      return foundRate;
    } catch (error) {
      throw error;
    }
  }

  async create(createRateDto: CreateRateDto) {
    try {
      const createdRate = await this.rateModal.create(createRateDto);
      return createdRate;
    } catch (error) {
      throw error;
    }
  }

  async update(updateRateDto: UpdateRateDto) {
    try {
      const { _id, ...data } = updateRateDto;
      const updatedRate = await this.rateModal.findByIdAndUpdate(_id, data, {
        new: true,
      });
      return updatedRate;
    } catch (error) {
      throw error;
    }
  }
}
