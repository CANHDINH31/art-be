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
import { Reply } from 'src/schemas/replies.schema';
import { Target } from 'src/schemas/targets.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TweetsService {
  private readonly model;
  private readonly configuration;
  constructor(
    private configService: ConfigService,
    @InjectModel(Profile.name) private profileModal: Model<Profile>,
    @InjectModel(Tweet.name) private tweetModal: Model<Tweet>,
    @InjectModel(Reply.name) private replyModal: Model<Reply>,
    @InjectModel(Target.name) private targetModal: Model<Target>,
  ) {
    this.configuration = new GoogleGenerativeAI(
      this.configService.get('AI_KEY'),
    );
    this.model = this.configuration.getGenerativeModel({
      model: 'gemini-pro',
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

      await this.targetModal.findByIdAndUpdate(body.target, {
        lastCrawl: body.lastCrawl,
      });

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

  @Cron('0 20-23 * * *')
  async autoReply() {
    try {
      const countDocument = await this.tweetModal.countDocuments({ status: 1 });
      const PAGE_SIZE = 20;
      const TOTAL_PAGE = Math.ceil(Number(countDocument) / PAGE_SIZE);

      for (let i = 1; i <= TOTAL_PAGE; i++) {
        const res = await this.findAll(PAGE_SIZE, i, '', PAGE_SIZE, '1');
        const listTweet: any = res?.data;

        for (const tweet of listTweet) {
          try {
            const resComment = await this.model.generateContent(
              `Comment on the content of the following article no more than 40 words including the icon in the most appropriate and best way. The content of the article is: ${tweet?.content}.`,
            );
            const comment =
              resComment?.response?.candidates?.[0]?.content?.parts?.[0]?.text +
              ` Visit link:  https://tranhtuongmienbac.com/?visit=${tweet.id}`;

            const profile = tweet.target.profile;
            const client = new TwitterApi({
              appKey: profile.appKey,
              appSecret: profile.appSecret,
              accessSecret: profile.accessSecret,
              accessToken: profile.accessToken,
            });
            const reply = await client.v2.reply(comment, tweet.tweetId);
            await this.replyModal.create({
              tweetId: reply.data.id,
              tweet: tweet._id,
              comment,
            });
            await this.tweetModal.findByIdAndUpdate(tweet._id, { status: 0 });
          } catch (error) {
            console.log(error);
            continue;
          }
        }
      }
      return 'finnish reply';
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(
    pageSize = 10,
    page = 1,
    searchText = '',
    limit: number,
    status: string,
  ) {
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
            { views: Number(searchText) },
          ],
        },
      ];

      if (status) {
        conditions.push({ status: Number(status) });
      }
      const query = { $and: conditions };
      const data = await this.tweetModal
        .find(query)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(take)
        .populate({
          path: 'target',
          populate: {
            path: 'profile',
          },
        });

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
