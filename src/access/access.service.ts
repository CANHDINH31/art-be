import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Access } from 'src/schemas/accesses.schema';
import { Model } from 'mongoose';

@Injectable()
export class AccessService {
  constructor(@InjectModel(Access.name) private accessModal: Model<Access>) {}

  async create(createAccessDto: CreateAccessDto) {
    try {
      return await this.accessModal.create({ ...createAccessDto, amount: 1 });
    } catch (error) {
      throw error;
    }
  }

  async findAll(visit?: string) {
    try {
      const query = {
        ...(visit && { visit: visit }),
      };
      return await this.accessModal.find(query).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} access`;
  }

  update(id: number, updateAccessDto: UpdateAccessDto) {
    return `This action updates a #${id} access`;
  }

  remove(id: number) {
    return `This action removes a #${id} access`;
  }
}
