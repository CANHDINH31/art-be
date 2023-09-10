import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { ConditionUserDto } from './dto/condition-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ListDeleteUserDto } from './dto/list-delete-user.dto';
import { DriveService } from 'src/drive/drive.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModal: Model<User>,
    private driveService: DriveService,
  ) {}
  async find(conditionUserDto: ConditionUserDto) {
    try {
      const user = await this.userModal
        .findOne({ ...conditionUserDto })
        .populate('favourite');
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const user = await this.find({ _id: id });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createByAdmin(file: Express.Multer.File, data) {
    try {
      let image;
      if (file) {
        image = await this.driveService.uploadFile(file);
      }

      const convertData = JSON.parse(data);
      const existUser = await this.find({
        email: convertData.email,
        provider: 'WEB',
      });

      if (!existUser) {
        const password = await bcrypt.hash(convertData.password, 10);
        await this.create({
          name: convertData.name,
          email: convertData.email,
          isAdmin: convertData.role == 'Admin',
          image,
          password,
        });
        return {
          status: HttpStatus.CREATED,
          message: 'Đăng kí tài khoản thành công',
        };
      }
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Email đã tồn tại',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateByAdmin(file: Express.Multer.File, data, id: string) {
    try {
      let image;
      if (file) {
        image = await this.driveService.uploadFile(file);
      }
      const convertData = JSON.parse(data);
      const password =
        convertData.password && (await bcrypt.hash(convertData.password, 10));

      await this.update({
        _id: id,
        name: convertData.name,
        email: convertData.email,
        isAdmin: convertData.role == 'Admin',
        ...(image && { image }),
        ...(password && { password }),
      });
      return {
        status: HttpStatus.CREATED,
        message: 'Cập nhật tài khoản thành công',
      };
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
      const updateUser = await this.userModal
        .findByIdAndUpdate(_id, data, {
          new: true,
        })
        .populate('favourite');
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

  async favourite(id: string, userId: string) {
    try {
      const user = await this.userModal.findOne({ _id: userId });

      if (user && user.favourite) {
        const index = user.favourite.indexOf(id);
        if (index !== -1) {
          user.favourite.splice(index, 1);
        } else {
          user.favourite.push(id);
        }
      } else {
        user.favourite = [id];
      }

      await user.save();
      return {
        status: HttpStatus.OK,
        data: user,
      };
    } catch (error) {}
  }

  async list(
    page = 1,
    pageSize = 10,
    searchText = '',
    limit: number,
    provider = '',
    role = '',
  ) {
    try {
      const skip = Number(pageSize) * (page - 1);
      const take = Number(limit) || Number(pageSize);

      const query: Partial<{
        provider: { $regex: string; $options: string };
        isAdmin: boolean;
        $or: (
          | { email: { $regex: string; $options: string }; name?: undefined }
          | { name: { $regex: string; $options: string }; email?: undefined }
        )[];
      }> = {
        provider: { $regex: provider, $options: 'i' },
        $or: [
          { email: { $regex: searchText, $options: 'i' } },
          { name: { $regex: searchText, $options: 'i' } },
        ],
      };

      if (role === 'Admin') {
        query.isAdmin = true;
      } else if (role === 'User') {
        query.isAdmin = false;
      }

      const data = await this.userModal
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take);

      const totalItems = await this.userModal.find(query).count();
      const totalPage = Math.ceil(totalItems / Number(pageSize));
      return {
        currentPage: Number(page),
        totalPage,
        itemsPerPage: Number(take),
        totalItems,
        data,
      };
    } catch (err) {
      throw err;
    }
  }

  async remove(listDeleteUserDto: ListDeleteUserDto) {
    try {
      await this.userModal.deleteMany({
        _id: { $in: listDeleteUserDto.listIdDelete },
      });
      return {
        status: HttpStatus.OK,
        message: 'Delete users successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
