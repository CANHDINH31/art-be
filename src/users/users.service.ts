import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { ConditionUserDto } from './dto/condition-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModal: Model<User>) {}
  async find(conditionUserDto: ConditionUserDto) {
    try {
      const user = await this.userModal.findOne({ ...conditionUserDto });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async create(createUserDto: CreateUserDto) {
    try {
      await this.userModal.create(createUserDto);
      return {
        status: HttpStatus.CREATED,
        message: 'Thêm tài khoản thành công',
      };
    } catch (error) {
      throw error;
    }
  }
}