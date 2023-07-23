import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { ConditionUserDto } from './dto/condition-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

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
      return await this.userModal.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const { _id, ...data } = updateUserDto;
      const updateUser = await this.userModal.findByIdAndUpdate(_id, data, {
        new: true,
      });
      return updateUser;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(payload: { password: string }, _id: string) {
    try {
      const password = await bcrypt.hash(payload.password, 10);
      await this.update({ _id, password });
      return {
        status: HttpStatus.OK,
        message: 'Cập nhật mật khẩu thành công',
      };
    } catch (error) {
      throw error;
    }
  }
}
