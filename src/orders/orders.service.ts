import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from 'src/schemas/orders.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModal: Model<Order>,
    @InjectQueue('orders') private sendMail: Queue,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderModal.create(createOrderDto);
      const payload = await this.orderModal
        .findOne({ _id: order._id })
        .sort({ createdAt: -1 })
        .populate('user')
        .populate('cart.paint');
      await this.sendMail.add(payload);
      return;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.orderModal
        .find({})
        .sort({ createdAt: -1 })
        .populate('user')
        .populate('cart.paint');
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
