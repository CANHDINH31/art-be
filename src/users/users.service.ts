import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { ConditionUserDto } from './dto/condition-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
}
