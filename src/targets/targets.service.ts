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

  findAll() {
    return `This action returns all targets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} target`;
  }

  update(id: number, updateTargetDto: UpdateTargetDto) {
    return `This action updates a #${id} target`;
  }

  remove(id: number) {
    return `This action removes a #${id} target`;
  }
}
