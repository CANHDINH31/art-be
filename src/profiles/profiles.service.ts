import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from 'src/schemas/profiles.schema';
import { Model } from 'mongoose';
import { TwitterApi } from 'twitter-api-v2';
import { SyncProfileDto } from './dto/sync-profile.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModal: Model<Profile>,
  ) {}

  async sync(syncProfileDto: SyncProfileDto) {
    try {
      const configuration = new GoogleGenerativeAI(
        'AIzaSyCaA0mWYRZDg7XPkQgzvISpqf5HK3grqhI',
      );
      const modelId = 'gemini-pro';
      const model = configuration.getGenerativeModel({ model: modelId });

      const result = await model.generateContent('Một số hình ảnh về việt');
      return result;

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

  findAll() {
    return `This action returns all profiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
