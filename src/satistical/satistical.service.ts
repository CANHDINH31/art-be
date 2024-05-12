import { Injectable } from '@nestjs/common';
import { CreateSatisticalDto } from './dto/create-satistical.dto';
import { UpdateSatisticalDto } from './dto/update-satistical.dto';
import { User } from 'src/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rate } from 'src/schemas/rates.schema';
import { Comment } from 'src/schemas/comments.schema';
import { Order } from 'src/schemas/orders.schema';
import { Access } from 'src/schemas/accesses.schema';
import { Paint } from 'src/schemas/paints.schema';

@Injectable()
export class SatisticalService {
  constructor(
    @InjectModel(Paint.name) private paintModal: Model<Paint>,
    @InjectModel(Access.name) private accessModal: Model<Access>,
    @InjectModel(Comment.name) private commentModal: Model<Comment>,
    @InjectModel(Order.name) private orderModal: Model<Order>,
    @InjectModel(Rate.name) private rateModal: Model<Rate>,
    @InjectModel(User.name) private userModal: Model<User>,
  ) {}

  create(createSatisticalDto: CreateSatisticalDto) {
    return 'This action adds a new satistical';
  }

  findAll() {
    return `This action returns all satistical`;
  }

  async basic() {
    try {
      const account = await this.userModal.countDocuments({});
      const access = await this.accessModal.countDocuments({});
      const comment = await this.commentModal.countDocuments({});
      const order = await this.orderModal.countDocuments({});
      const rate = await this.rateModal.countDocuments({});
      const paint = await this.paintModal.countDocuments({});

      return {
        account,
        access,
        comment,
        order,
        rate,
        paint,
      };
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} satistical`;
  }

  update(id: number, updateSatisticalDto: UpdateSatisticalDto) {
    return `This action updates a #${id} satistical`;
  }

  remove(id: number) {
    return `This action removes a #${id} satistical`;
  }
}
