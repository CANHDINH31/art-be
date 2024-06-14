import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from 'src/schemas/orders.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Paint } from 'src/schemas/paints.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModal: Model<Order>,
    @InjectModel(Paint.name) private paintModal: Model<Paint>,
    @InjectQueue('orders') private sendMail: Queue,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    try {
      const listProduct = createOrderDto.cart;
      for (const pr of listProduct) {
        await this.paintModal.findByIdAndUpdate(pr.paint, {
          $inc: { stock: -Number(pr.amount) },
        });
      }
      await this.sendMail.empty();
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

  async findAll(
    pageSize = 10,
    page = 1,
    searchText = '',
    limit: number,
    userId: string,
  ) {
    try {
      const skip = Number(pageSize) * (page - 1);
      const take = limit ? Number(limit) : Number(pageSize);
      const conditions: any = [
        {
          $or: [
            { name: { $regex: searchText, $options: 'i' } },
            { phone: { $regex: searchText, $options: 'i' } },
            { address: { $regex: searchText, $options: 'i' } },
          ],
        },
      ];

      if (userId) {
        conditions.push({ user: userId });
      }

      const query = { $and: conditions };
      const data = await this.orderModal
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take)
        .populate('user')
        .populate('cart.paint');

      const totalItems = await this.orderModal.find(query).count();
      const totalPage = Math.ceil(totalItems / Number(pageSize));

      return {
        currentPage: Number(page),
        totalPage,
        itemsPerPage: Number(take),
        totalItems,
        data,
      };
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
