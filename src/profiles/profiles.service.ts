import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from 'src/schemas/profiles.schema';
import { Model } from 'mongoose';
import { TwitterApi } from 'twitter-api-v2';
import { SyncProfileDto } from './dto/sync-profile.dto';
import { UpdateByCrawlProfileDto } from './dto/update-by-crawl-profile.dto';
import { UpdateByUsernameDto } from './dto/update-by-username-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModal: Model<Profile>,
  ) {}

  async updateByUSername(updateByUsernameDto: UpdateByUsernameDto) {
    try {
      const data = await this.profileModal.findOneAndUpdate(
        { username: updateByUsernameDto.username },
        updateByUsernameDto,
        { new: true },
      );
      return {
        status: HttpStatus.CREATED,
        message: 'Thêm mới profile thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async sync(syncProfileDto: SyncProfileDto) {
    try {
      const client = new TwitterApi(syncProfileDto);
      const data = await client.v2.me();
      const existProfile = await this.profileModal.findOne({
        id: data.data.id,
      });
      if (existProfile) {
        await this.profileModal.findByIdAndUpdate(existProfile._id, {
          ...data.data,
          ...syncProfileDto,
        });
      } else {
        await this.profileModal.create({ ...data.data, ...syncProfileDto });
      }
      return {
        status: HttpStatus.CREATED,
        message: 'Thêm mới profile thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.profileModal.find({});
    } catch (error) {
      throw error;
    }
  }

  async getListUsername() {
    try {
      return await this.profileModal.find({}).select('username');
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.profileModal.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async updateByCrawl(updateByCrawlProfileDto: UpdateByCrawlProfileDto) {
    try {
      const profile = await this.profileModal.findOne({
        username: updateByCrawlProfileDto.username,
      });
      if (!profile) return;
      const data = await this.profileModal.findByIdAndUpdate(
        profile._id,
        updateByCrawlProfileDto,
        { new: true },
      );

      return {
        status: HttpStatus.CREATED,
        message: 'Cập nhật profile thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
