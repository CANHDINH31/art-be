import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Target } from 'src/schemas/targets.schema';
import { Model } from 'mongoose';

@Injectable()
export class TargetsService {
  constructor(@InjectModel(Target.name) private targetModal: Model<Target>) {}
  async create(createTargetDto: CreateTargetDto) {
    try {
      const data = await this.targetModal.create(createTargetDto);
      return {
        status: HttpStatus.CREATED,
        messgae: 'Create target successfully',
        data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(profileId: string, status: string) {
    try {
      const query = {
        ...(profileId && { profile: profileId }),
        ...(status && { status: Number(status) }),
      };
      return await this.targetModal
        .find(query)
        .populate('profile')
        .sort({ lastCrawl: 1 });
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} target`;
  }

  async update(id: string, updateTargetDto: UpdateTargetDto) {
    try {
      const data = await this.targetModal.findByIdAndUpdate(
        id,
        updateTargetDto,
        { new: true },
      );
      return {
        status: HttpStatus.CREATED,
        messgae: 'Update target successfully',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.targetModal.findByIdAndUpdate(id, { status: 0 });
      return {
        status: HttpStatus.CREATED,
        messgae: 'Xóa target thành công',
      };
    } catch (error) {
      throw error;
    }
  }
}
