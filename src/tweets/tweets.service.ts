import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { AiTweetDto } from './dto/ai-tweet.dto';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from 'src/schemas/profiles.schema';
import { Model } from 'mongoose';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class TweetsService {
  private readonly model;
  private readonly configuration;
  constructor(
    private configService: ConfigService,
    @InjectModel(Profile.name) private profileModal: Model<Profile>,
  ) {
    this.configuration = new GoogleGenerativeAI(
      this.configService.get('AI_KEY'),
    );
    this.model = this.configuration.getGenerativeModel({
      model: this.configService.get('AI_MODEl'),
    });
  }
  async ai(aiTweetDto: AiTweetDto) {
    try {
      return await this.model.generateContent(aiTweetDto.prompt);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(file: Express.Multer.File, createTweetDto) {
    try {
      const convertData = JSON.parse(createTweetDto.data);
      const profile = await this.profileModal.findOne({
        _id: convertData.profileId,
      });
      const client = new TwitterApi({
        appKey: profile.appKey,
        appSecret: profile.appSecret,
        accessSecret: profile.accessSecret,
        accessToken: profile.accessToken,
      });

      const mediaId = await client.v1.uploadMedia(file.buffer, {
        type: file.mimetype,
      });

      await client.v2.tweet({
        media: {
          media_ids: [mediaId],
        },
        text: convertData.content,
      });

      return {
        status: HttpStatus.CREATED,
        message: 'Đăng bài thành công',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all tweets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tweet`;
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
