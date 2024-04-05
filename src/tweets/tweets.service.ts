import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { AiTweetDto } from './dto/ai-tweet.dto';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from 'src/schemas/profiles.schema';
import { Model } from 'mongoose';
import { TwitterApi } from 'twitter-api-v2';
import { Tweet } from 'src/schemas/tweets.schema';

@Injectable()
export class TweetsService {
  private readonly model;
  private readonly configuration;
  constructor(
    private configService: ConfigService,
    @InjectModel(Profile.name) private profileModal: Model<Profile>,
    @InjectModel(Tweet.name) private tweetModal: Model<Tweet>,
  ) {
    this.configuration = new GoogleGenerativeAI(
      this.configService.get('AI_KEY'),
    );
    this.model = this.configuration.getGenerativeModel({
      model: this.configService.get('AI_MODEl'),
    });
  }

  async sync(body) {
    try {
      for (const tweet of body.data) {
        const existTweet = await this.tweetModal.findOne({
          tweetId: tweet.tweetId,
        });
        if (existTweet) {
          await this.tweetModal.findByIdAndUpdate(existTweet._id, {
            ...tweet,
            target: body.target,
            lastCrawl: body.lastCrawl,
          });
        } else {
          await this.tweetModal.create({
            ...tweet,
            target: body.target,
            lastCrawl: body.lastCrawl,
          });
        }
      }

      return {
        status: HttpStatus.CREATED,
        message: 'Lưu tweet thành công',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
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

  async findAll(pageSize = 10, page = 1, searchText = '', limit: number) {
    try {
      const skip = Number(pageSize) * (page - 1);
      const take = limit ? Number(limit) : Number(pageSize);

      const conditions: any = [
        {
          $or: [
            { username: { $regex: searchText, $options: 'i' } },
            { name: { $regex: searchText, $options: 'i' } },
            { content: { $regex: searchText, $options: 'i' } },
            { likes: Number(searchText) },
            { replies: Number(searchText) },
            { retweets: Number(searchText) },
            { views: { $regex: searchText, $options: 'i' } },
          ],
        },
      ];

      const query = { $and: conditions };
      const data = await this.tweetModal
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take);

      const totalItems = await this.tweetModal.find(query).count();
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

  async findOne(id: string) {
    try {
      return await this.tweetModal.findById(id).populate('target');
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
