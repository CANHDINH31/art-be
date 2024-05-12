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
import { Access } from 'src/schemas/accesses.schema';
import { Comment } from 'src/schemas/comments.schema';
import { Order } from 'src/schemas/orders.schema';
import { Rate } from 'src/schemas/rates.schema';
import { User } from 'src/schemas/users.schema';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TweetsService {
  private readonly model;
  private readonly configuration;
  private readonly MIN_SCORE = 50;
  constructor(
    private configService: ConfigService,
    @InjectModel(Profile.name) private profileModal: Model<Profile>,
    @InjectModel(Tweet.name) private tweetModal: Model<Tweet>,
    @InjectModel(Reply.name) private replyModal: Model<Reply>,
    @InjectModel(Target.name) private targetModal: Model<Target>,
    @InjectModel(Access.name) private accessModal: Model<Access>,
    @InjectModel(Comment.name) private commentModal: Model<Comment>,
    @InjectModel(Order.name) private orderModal: Model<Order>,
    @InjectModel(Rate.name) private rateModal: Model<Rate>,
    @InjectModel(User.name) private userModal: Model<User>,
    private readonly httpService: HttpService,
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

  // @Cron('0 20-23 * * *')
  async autoReply() {
    try {
      const countDocument = await this.tweetModal.countDocuments({ status: 1 });
      const PAGE_SIZE = 20;
      const TOTAL_PAGE = Math.ceil(Number(countDocument) / PAGE_SIZE);

      console.log(countDocument, 'countDocument');

      for (let i = 1; i <= TOTAL_PAGE; i++) {
        const res = await this.findAll(PAGE_SIZE, i, '', PAGE_SIZE, '1');
        const listTweet: any = res?.data;

        for (const tweet of listTweet) {
          const score = await this.getScore(tweet);
          const tweetId = tweet.id;

          if (score < this.MIN_SCORE) {
            await this.tweetModal.findByIdAndUpdate(tweet._id, { status: 0 });
            continue;
          }

          try {
            const resComment = await this.model.generateContent(
              `Comment on the content of the following article no more than 40 words including the icon in the most appropriate and best way. The content of the article is: ${tweet?.content}.`,
            );
            const comment =
              resComment?.response?.candidates?.[0]?.content?.parts?.[0]?.text +
              `\n Visit link:  https://tranhtuongmienbac.com/?visit=${tweet.id}`;
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
          } catch (error: any) {
            if (error?.data?.status === 403) {
              await this.tweetModal.findByIdAndDelete(tweetId);
            }
            if (error?.data?.status !== 429) {
              console.log(error);
            }
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
        .sort({ createdAt: -1 })
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

  async exportCsv(pageSize = 100, page = 1, limit: number) {
    try {
      const skip = Number(pageSize) * (page - 1);
      const take = limit ? Number(limit) : Number(pageSize);

      const listResult = [];
      const listTweet = await this.tweetModal
        .find({ status: 0 })
        .skip(skip)
        .limit(take)
        .sort({ createdAt: -1 })
        .populate({
          path: 'target',
          populate: {
            path: 'profile',
          },
        });

      for (const tweet of listTweet) {
        const reply = await this.replyModal.findOne({ tweet: tweet._id });
        const webAccess = await this.accessModal.countDocuments({
          visit: tweet._id.toString(),
        });
        const webComment = await this.commentModal.countDocuments({
          visit: tweet._id.toString(),
        });

        const webOrder = await this.orderModal.countDocuments({
          visit: tweet._id.toString(),
        });

        const webRate = await this.rateModal.countDocuments({
          visit: tweet._id.toString(),
        });

        const webUser = await this.userModal.countDocuments({
          visit: tweet._id.toString(),
        });

        listResult.push({
          ...tweet.toObject(),
          reply,
          webAccess,
          webComment,
          webOrder,
          webRate,
          webUser,
        });
      }

      const data = listResult?.map((tweet: any) => ({
        tweetId: tweet?._id,
        tweetReply: tweet?.replies,
        tweetRetweet: tweet?.retweets,
        tweetLike: tweet?.likes,
        tweetView: tweet?.views,
        topReply: tweet?.topComment?.replies,
        topRetweet: tweet?.topComment?.retweets,
        topLike: tweet?.topComment?.likes,
        topView: tweet?.topComment?.views,
        replyReply: tweet?.reply?.replies,
        replyRetweet: tweet?.reply?.retweets,
        replyLike: tweet?.reply?.likes,
        replyView: tweet?.reply?.views,
        webAccess: tweet?.webAccess,
        webComment: tweet?.webComment,
        webOrder: tweet?.webOrder,
        webRate: tweet?.webRate,
        webUser: tweet?.webUser,
        tweetFollower: tweet?.follower?.split(' ')?.[0]
          ? this.convertShortNumberToFull(tweet?.follower?.split(' ')?.[0])
          : 0,
        tweetFollowing: tweet?.following?.split(' ')?.[0]
          ? this.convertShortNumberToFull(tweet?.following?.split(' ')?.[0])
          : 0,
        userFollower: tweet?.target?.profile?.follower?.split(' ')?.[0],
        userFollowing: tweet?.target?.profile?.following?.split(' ')?.[0],
      }));

      return {
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  private convertShortNumberToFull(number: string) {
    const multiplier = {
      K: 1000,
      M: 1000000,
      B: 1000000000,
    };

    const sanitizedNumber = number?.replace(/,/g, '');
    const numericPart = parseFloat(sanitizedNumber);
    const suffix = sanitizedNumber.slice(-1).toUpperCase();

    if (multiplier.hasOwnProperty(suffix)) {
      return numericPart * multiplier[suffix];
    }

    return numericPart;
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

  async getScore(tweet: any) {
    try {
      const data = [
        tweet?.replies,
        tweet?.retweets,
        tweet?.likes,
        tweet?.views,
        tweet?.topComment?.replies,
        tweet?.topComment?.retweets,
        tweet?.topComment?.likes,
        tweet?.topComment?.views,
        tweet?.follower?.split(' ')?.[0]
          ? this.convertShortNumberToFull(tweet?.follower?.split(' ')?.[0])
          : 0,
        tweet?.following?.split(' ')?.[0]
          ? this.convertShortNumberToFull(tweet?.following?.split(' ')?.[0])
          : 0,
        tweet?.target?.profile?.follower?.split(' ')?.[0]
          ? this.convertShortNumberToFull(
              tweet?.target?.profile?.follower?.split(' ')?.[0],
            )
          : 0,
        tweet?.target?.profile?.following?.split(' ')?.[0]
          ? this.convertShortNumberToFull(
              tweet?.target?.profile?.follower?.split(' ')?.[0],
            )
          : 0,
      ];

      const res = await this.httpService.axiosRef.post(
        this.configService.get('AI_DOMAIN') + 'api/prediction/',
        { data },
      );

      return res.data?.data;
    } catch (error) {
      throw error;
    }
  }
}
